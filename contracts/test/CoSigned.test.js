const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * CoSigned Test Suite — Part 1 (Day 11)
 * Tests 1–4: Bond creation and acceptance
 *
 * Part 2 (Day 12): dual-signature, NFT mint, soulbound revert
 * Part 3 (Day 13): dispute, refund, edge cases
 */

describe("CoSigned", function () {

  // ── Shared fixtures ────────────────────────────────────────────────────────

  /**
   * Deploys a fresh CoSigned contract before each test.
   * CoSigned constructor deploys CoSignedNFT internally.
   */
  async function deployCoSigned() {
    const [owner, mentor, learner, stranger] = await ethers.getSigners();

    const CoSigned = await ethers.getContractFactory("CoSigned");
    const cosigned = await CoSigned.deploy();
    await cosigned.waitForDeployment();

    // Retrieve the NFT contract address from the deployed CoSigned
    const nftAddress = await cosigned.nftContract();
    const CoSignedNFT = await ethers.getContractFactory("CoSignedNFT");
    const nft = CoSignedNFT.attach(nftAddress);

    // Shared bond parameters
    const skillTitle       = "React State Management";
    const successCriteria  = "Build a working Zustand store with persistence";
    const deadline         = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
    const ipfsHash         = "QmTestHashABC123";
    const stakeAmount      = ethers.parseEther("0.05");

    return { cosigned, nft, owner, mentor, learner, stranger, skillTitle, successCriteria, deadline, ipfsHash, stakeAmount };
  }

  // ── Test 1 ─────────────────────────────────────────────────────────────────

  it("1. should allow mentor to create a bond", async function () {
    const { cosigned, mentor, learner, skillTitle, successCriteria, deadline, ipfsHash } = await deployCoSigned();

    const tx = await cosigned.connect(mentor).createBond(
      learner.address, skillTitle, successCriteria, deadline, ipfsHash
    );
    await tx.wait();

    // bondCounter should be 1
    expect(await cosigned.bondCounter()).to.equal(1n);

    // Bond struct fields should match
    const bond = await cosigned.getBond(1);
    expect(bond.id).to.equal(1n);
    expect(bond.mentor).to.equal(mentor.address);
    expect(bond.learner).to.equal(learner.address);
    expect(bond.skillTitle).to.equal(skillTitle);
    expect(bond.successCriteria).to.equal(successCriteria);
    expect(bond.ipfsHash).to.equal(ipfsHash);
    expect(bond.status).to.equal(0n); // BondStatus.Pending = 0
    expect(bond.stakeAmount).to.equal(0n);
    expect(bond.mentorSigned).to.equal(false);
    expect(bond.learnerSigned).to.equal(false);
    expect(bond.disputeOpenedAt).to.equal(0n);

    // Address mappings should be updated
    const mentorBonds  = await cosigned.getBondsByAddress(mentor.address);
    const learnerBonds = await cosigned.getBondsByAddress(learner.address);
    expect(mentorBonds).to.include(1n);
    expect(learnerBonds).to.include(1n);

    // BondCreated event should be emitted
    await expect(
      cosigned.connect(mentor).createBond(learner.address, skillTitle, successCriteria, deadline, ipfsHash)
    ).to.emit(cosigned, "BondCreated")
      .withArgs(2n, mentor.address, learner.address, skillTitle, BigInt(deadline));
  });

  // ── Test 2 ─────────────────────────────────────────────────────────────────

  it("2. should NOT allow mentor to create a bond with themselves as learner", async function () {
    const { cosigned, mentor, successCriteria, deadline, ipfsHash } = await deployCoSigned();

    await expect(
      cosigned.connect(mentor).createBond(
        mentor.address, // learner == mentor — should revert
        "Self-mentorship",
        successCriteria,
        deadline,
        ipfsHash
      )
    ).to.be.revertedWith("CoSigned: mentor cannot be learner");
  });

  // ── Test 3 ─────────────────────────────────────────────────────────────────

  it("3. should allow learner to accept bond with correct stake", async function () {
    const { cosigned, mentor, learner, skillTitle, successCriteria, deadline, ipfsHash, stakeAmount } = await deployCoSigned();

    // Mentor creates bond
    await cosigned.connect(mentor).createBond(learner.address, skillTitle, successCriteria, deadline, ipfsHash);

    // Track contract ETH balance before
    const contractAddress = await cosigned.getAddress();
    const balanceBefore = await ethers.provider.getBalance(contractAddress);

    // Learner accepts with stake
    const tx = await cosigned.connect(learner).acceptBond(1, { value: stakeAmount });
    await tx.wait();

    // Bond status should be Active (1)
    const bond = await cosigned.getBond(1);
    expect(bond.status).to.equal(1n); // BondStatus.Active = 1
    expect(bond.stakeAmount).to.equal(stakeAmount);

    // Contract should hold the ETH
    const balanceAfter = await ethers.provider.getBalance(contractAddress);
    expect(balanceAfter - balanceBefore).to.equal(stakeAmount);

    // BondAccepted event
    await expect(
      cosigned.connect(mentor).createBond(learner.address, skillTitle, successCriteria, deadline, ipfsHash)
        .then(() => cosigned.connect(learner).acceptBond(2, { value: stakeAmount }))
    ).to.emit(cosigned, "BondAccepted")
      .withArgs(2n, learner.address, stakeAmount);
  });

  // ── Test 4 ─────────────────────────────────────────────────────────────────

  it("4. should NOT allow wrong address to accept bond", async function () {
    const { cosigned, mentor, learner, stranger, skillTitle, successCriteria, deadline, ipfsHash, stakeAmount } = await deployCoSigned();

    // Mentor creates bond for learner
    await cosigned.connect(mentor).createBond(learner.address, skillTitle, successCriteria, deadline, ipfsHash);

    // Stranger tries to accept — should revert
    await expect(
      cosigned.connect(stranger).acceptBond(1, { value: stakeAmount })
    ).to.be.revertedWith("CoSigned: not the designated learner");

    // Mentor tries to accept their own bond — should also revert
    await expect(
      cosigned.connect(mentor).acceptBond(1, { value: stakeAmount })
    ).to.be.revertedWith("CoSigned: not the designated learner");

    // Zero stake should revert
    await expect(
      cosigned.connect(learner).acceptBond(1, { value: 0n })
    ).to.be.revertedWith("CoSigned: stake amount must be > 0");
  });

  // ── Helper: create + accept a bond (used by Day 12+ tests) ─────────────────

  async function createAndAcceptBond(cosigned, mentor, learner, skillTitle, successCriteria, deadline, ipfsHash, stakeAmount) {
    await cosigned.connect(mentor).createBond(learner.address, skillTitle, successCriteria, deadline, ipfsHash);
    await cosigned.connect(learner).acceptBond(1, { value: stakeAmount });
    return 1; // bondId
  }

  // ── Test 5 ─────────────────────────────────────────────────────────────────

  it("5. should complete bond when both parties sign", async function () {
    const { cosigned, mentor, learner, skillTitle, successCriteria, deadline, ipfsHash, stakeAmount } = await deployCoSigned();

    await createAndAcceptBond(cosigned, mentor, learner, skillTitle, successCriteria, deadline, ipfsHash, stakeAmount);

    // Mentor signs first
    await cosigned.connect(mentor).signCompletion(1);
    let bond = await cosigned.getBond(1);
    expect(bond.status).to.equal(2n);       // BondStatus.MentorSigned = 2
    expect(bond.mentorSigned).to.equal(true);
    expect(bond.learnerSigned).to.equal(false);

    // Learner signs second — triggers completion
    const tx = await cosigned.connect(learner).signCompletion(1);
    await tx.wait();

    bond = await cosigned.getBond(1);
    expect(bond.status).to.equal(4n);       // BondStatus.Completed = 4
    expect(bond.mentorSigned).to.equal(true);
    expect(bond.learnerSigned).to.equal(true);
    expect(bond.stakeAmount).to.equal(0n);  // zeroed after refund

    // BondCompleted event emitted
    await expect(tx).to.emit(cosigned, "BondCompleted")
      .withArgs(1n, mentor.address, learner.address);
  });

  it("5b. should also complete when learner signs first", async function () {
    const { cosigned, mentor, learner, skillTitle, successCriteria, deadline, ipfsHash, stakeAmount } = await deployCoSigned();

    await createAndAcceptBond(cosigned, mentor, learner, skillTitle, successCriteria, deadline, ipfsHash, stakeAmount);

    // Learner signs first
    await cosigned.connect(learner).signCompletion(1);
    let bond = await cosigned.getBond(1);
    expect(bond.status).to.equal(3n);       // BondStatus.LearnerSigned = 3

    // Mentor signs second — triggers completion
    await cosigned.connect(mentor).signCompletion(1);
    bond = await cosigned.getBond(1);
    expect(bond.status).to.equal(4n);       // BondStatus.Completed = 4
  });

  // ── Test 6 ─────────────────────────────────────────────────────────────────

  it("6. should mint soulbound NFTs to both parties on completion", async function () {
    const { cosigned, nft, mentor, learner, skillTitle, successCriteria, deadline, ipfsHash, stakeAmount } = await deployCoSigned();

    await createAndAcceptBond(cosigned, mentor, learner, skillTitle, successCriteria, deadline, ipfsHash, stakeAmount);

    // Both sign
    await cosigned.connect(mentor).signCompletion(1);
    await cosigned.connect(learner).signCompletion(1);

    // Learner should own token 1 (LEARNER_PROOF — minted first)
    expect(await nft.ownerOf(1)).to.equal(learner.address);
    // Mentor should own token 2 (MENTOR_PROOF — minted second)
    expect(await nft.ownerOf(2)).to.equal(mentor.address);

    // Token types should be correct
    // TokenType.LEARNER_PROOF = 0, TokenType.MENTOR_PROOF = 1
    expect(await nft.tokenTypes(1)).to.equal(0n); // LEARNER_PROOF
    expect(await nft.tokenTypes(2)).to.equal(1n); // MENTOR_PROOF

    // Both tokens should be locked (ERC-5192)
    expect(await nft.locked(1)).to.equal(true);
    expect(await nft.locked(2)).to.equal(true);

    // Metadata URI should match the bond's ipfsHash
    expect(await nft.tokenURI(1)).to.equal(ipfsHash);
    expect(await nft.tokenURI(2)).to.equal(ipfsHash);
  });

  // ── Test 7 ─────────────────────────────────────────────────────────────────

  it("7. should revert transfer of soulbound NFT", async function () {
    const { cosigned, nft, mentor, learner, stranger, skillTitle, successCriteria, deadline, ipfsHash, stakeAmount } = await deployCoSigned();

    await createAndAcceptBond(cosigned, mentor, learner, skillTitle, successCriteria, deadline, ipfsHash, stakeAmount);

    // Complete the bond to mint NFTs
    await cosigned.connect(mentor).signCompletion(1);
    await cosigned.connect(learner).signCompletion(1);

    // Learner owns token 1 — attempt to transfer should revert
    await expect(
      nft.connect(learner).transferFrom(learner.address, stranger.address, 1)
    ).to.be.revertedWith("CoSignedNFT: soulbound - non-transferable");

    // Mentor owns token 2 — attempt to transfer should revert
    await expect(
      nft.connect(mentor).transferFrom(mentor.address, stranger.address, 2)
    ).to.be.revertedWith("CoSignedNFT: soulbound - non-transferable");

    // approve should also revert
    await expect(
      nft.connect(learner).approve(stranger.address, 1)
    ).to.be.revertedWith("CoSignedNFT: soulbound - non-transferable");

    // setApprovalForAll should also revert
    await expect(
      nft.connect(learner).setApprovalForAll(stranger.address, true)
    ).to.be.revertedWith("CoSignedNFT: soulbound - non-transferable");

    // Ownership should be unchanged
    expect(await nft.ownerOf(1)).to.equal(learner.address);
    expect(await nft.ownerOf(2)).to.equal(mentor.address);
  });

});
