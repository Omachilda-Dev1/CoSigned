// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CoSigned
 * @notice Dual-signature mentorship Bond protocol.
 *         A mentor and learner co-sign a Bond on-chain.
 *         When both sign, soulbound NFTs are minted to each party.
 * @dev Day 5: Bond struct, BondStatus enum, storage mappings, events
 *      Day 6: createBond, acceptBond
 *      Day 7: signCompletion, _mintSoulboundNFTs (placeholder)
 *      Day 8: disputeBond, resolveDispute
 *      Day 10: wire to CoSignedNFT (coming)
 */
contract CoSigned is ReentrancyGuard {

    // ─────────────────────────────────────────────────────────────────────────
    // ENUMS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice All possible states of a Bond.
     * @dev Terminal states: Completed, Disputed (after resolveDispute).
     */
    enum BondStatus {
        Pending,        // Created by mentor, awaiting learner acceptance
        Active,         // Learner accepted and staked ETH
        MentorSigned,   // Mentor signed, waiting on learner
        LearnerSigned,  // Learner signed, waiting on mentor
        Completed,      // Both signed — NFTs minted, stake refunded
        Disputed        // Deadline passed, dispute raised, 7-day window open
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STRUCTS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Represents a single mentorship Bond between a mentor and learner.
     * @dev Gas note: uint256 fields each occupy a full 32-byte slot.
     *      address (20 bytes) + bool + bool = 22 bytes — fits in one slot.
     *      Struct ordering is optimised for clarity; gas optimisation is post-MVP.
     */
    struct Bond {
        uint256 id;                 // Auto-incremented bond ID (starts at 1)
        address mentor;             // Wallet that created the bond
        address learner;            // Wallet that accepted the bond
        string skillTitle;          // e.g. "React State Management"
        string successCriteria;     // e.g. "Build a working Zustand store"
        uint256 stakeAmount;        // ETH staked by learner in wei (0 until accepted)
        BondStatus status;          // Current lifecycle state
        uint256 deadline;           // Unix timestamp — bond must complete by this date
        string ipfsHash;            // IPFS CID of evidence/metadata JSON
        bool mentorSigned;          // Has mentor called signCompletion?
        bool learnerSigned;         // Has learner called signCompletion?
        uint256 disputeOpenedAt;    // Timestamp when dispute was raised (0 if none)
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STATE VARIABLES
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Total number of bonds created. Also used as the next bond ID.
    uint256 public bondCounter;

    /// @notice All bonds by ID.
    mapping(uint256 => Bond) public bonds;

    /// @notice All bond IDs where a given address is the mentor.
    mapping(address => uint256[]) public mentorBonds;

    /// @notice All bond IDs where a given address is the learner.
    mapping(address => uint256[]) public learnerBonds;

    // ─────────────────────────────────────────────────────────────────────────
    // EVENTS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Emitted when a mentor creates a new Bond.
     * @param bondId   The unique ID of the created bond.
     * @param mentor   Address of the mentor who created it.
     * @param learner  Address of the designated learner.
     * @param skillTitle  The skill being mentored.
     * @param deadline Unix timestamp deadline for the bond.
     */
    event BondCreated(
        uint256 indexed bondId,
        address indexed mentor,
        address indexed learner,
        string skillTitle,
        uint256 deadline
    );

    /**
     * @notice Emitted when a learner accepts a Bond and stakes ETH.
     * @param bondId      The bond that was accepted.
     * @param learner     Address of the learner.
     * @param stakeAmount Amount of ETH staked in wei.
     */
    event BondAccepted(
        uint256 indexed bondId,
        address indexed learner,
        uint256 stakeAmount
    );

    /**
     * @notice Emitted when either party signs completion.
     * @param bondId        The bond being signed.
     * @param signer        Address of the party who signed.
     * @param mentorSigned  Whether the mentor has signed.
     * @param learnerSigned Whether the learner has signed.
     */
    event BondSigned(
        uint256 indexed bondId,
        address indexed signer,
        bool mentorSigned,
        bool learnerSigned
    );

    /**
     * @notice Emitted when both parties have signed and the bond is complete.
     * @param bondId  The completed bond.
     * @param mentor  Address of the mentor.
     * @param learner Address of the learner.
     */
    event BondCompleted(
        uint256 indexed bondId,
        address indexed mentor,
        address indexed learner
    );

    /**
     * @notice Emitted when a dispute is raised after the deadline.
     * @param bondId          The disputed bond.
     * @param raisedBy        Address of the party who raised the dispute.
     * @param disputeOpenedAt Timestamp when the dispute was opened.
     */
    event BondDisputed(
        uint256 indexed bondId,
        address indexed raisedBy,
        uint256 disputeOpenedAt
    );

    /**
     * @notice Emitted when a dispute is resolved and stake is refunded.
     * @param bondId         The resolved bond.
     * @param resolvedBy     Address of the caller who triggered resolution.
     * @param refundedAmount Amount of ETH refunded to the learner in wei.
     */
    event DisputeResolved(
        uint256 indexed bondId,
        address indexed resolvedBy,
        uint256 refundedAmount
    );

    // ─────────────────────────────────────────────────────────────────────────
    // WRITE FUNCTIONS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Mentor creates a new Bond for a designated learner.
     * @dev Increments bondCounter, stores the Bond, updates both address mappings.
     *      ipfsHash should be the CID of the evidence/metadata JSON uploaded
     *      to IPFS before calling this function.
     * @param learner          Address of the learner for this bond.
     * @param skillTitle       Short title of the skill being mentored.
     * @param successCriteria  Description of what completion looks like.
     * @param deadline         Unix timestamp — bond must complete before this.
     * @param ipfsHash         IPFS CID of the bond evidence/metadata JSON.
     * @return bondId          The ID of the newly created bond.
     */
    function createBond(
        address learner,
        string calldata skillTitle,
        string calldata successCriteria,
        uint256 deadline,
        string calldata ipfsHash
    ) external returns (uint256 bondId) {
        // ── Checks ──────────────────────────────────────────────────────────
        require(learner != address(0),   "CoSigned: invalid learner address");
        require(learner != msg.sender,   "CoSigned: mentor cannot be learner");
        require(deadline > block.timestamp, "CoSigned: deadline must be in future");
        require(bytes(skillTitle).length > 0,       "CoSigned: skill title required");
        require(bytes(successCriteria).length > 0,  "CoSigned: success criteria required");

        // ── Effects ─────────────────────────────────────────────────────────
        bondCounter++;
        bondId = bondCounter;

        bonds[bondId] = Bond({
            id:              bondId,
            mentor:          msg.sender,
            learner:         learner,
            skillTitle:      skillTitle,
            successCriteria: successCriteria,
            stakeAmount:     0,
            status:          BondStatus.Pending,
            deadline:        deadline,
            ipfsHash:        ipfsHash,
            mentorSigned:    false,
            learnerSigned:   false,
            disputeOpenedAt: 0
        });

        mentorBonds[msg.sender].push(bondId);
        learnerBonds[learner].push(bondId);

        emit BondCreated(bondId, msg.sender, learner, skillTitle, deadline);
    }

    /**
     * @notice Learner accepts a Pending bond and stakes ETH as commitment.
     * @dev ETH is held in this contract until completion or dispute resolution.
     *      No transfer occurs here — only on signCompletion or resolveDispute.
     *      msg.value becomes the stakeAmount; any amount > 0 is accepted.
     *      Frontend should suggest a minimum (e.g. 0.001 ETH) for UX.
     * @param bondId The ID of the bond to accept.
     */
    function acceptBond(uint256 bondId) external payable {
        Bond storage bond = bonds[bondId];

        // ── Checks ──────────────────────────────────────────────────────────
        require(bond.learner == msg.sender,          "CoSigned: not the designated learner");
        require(bond.status == BondStatus.Pending,   "CoSigned: bond not in pending state");
        require(msg.value > 0,                       "CoSigned: stake amount must be > 0");
        require(block.timestamp < bond.deadline,     "CoSigned: bond deadline has passed");

        // ── Effects ─────────────────────────────────────────────────────────
        bond.stakeAmount = msg.value;
        bond.status      = BondStatus.Active;

        emit BondAccepted(bondId, msg.sender, msg.value);
    }

    /**
     * @notice Either party signs off on bond completion.
     * @dev The second signature triggers: stake refund + NFT mint.
     *      Implements Checks-Effects-Interactions to prevent reentrancy.
     *      nonReentrant provides a second layer of protection on the ETH transfer.
     *
     *      State machine:
     *        Active       + mentor signs  → MentorSigned
     *        Active       + learner signs → LearnerSigned
     *        MentorSigned + learner signs → Completed (refund + mint)
     *        LearnerSigned + mentor signs → Completed (refund + mint)
     *
     * @param bondId The ID of the bond to sign.
     */
    function signCompletion(uint256 bondId) external nonReentrant {
        Bond storage bond = bonds[bondId];

        // ── Checks ──────────────────────────────────────────────────────────
        require(
            msg.sender == bond.mentor || msg.sender == bond.learner,
            "CoSigned: not a party to this bond"
        );
        require(
            bond.status == BondStatus.Active       ||
            bond.status == BondStatus.MentorSigned ||
            bond.status == BondStatus.LearnerSigned,
            "CoSigned: bond not in signable state"
        );

        // ── Effects: record this party's signature ───────────────────────────
        if (msg.sender == bond.mentor) {
            require(!bond.mentorSigned, "CoSigned: mentor already signed");
            bond.mentorSigned = true;
        } else {
            require(!bond.learnerSigned, "CoSigned: learner already signed");
            bond.learnerSigned = true;
        }

        // Update status to reflect current signature state
        if (bond.mentorSigned && !bond.learnerSigned) {
            bond.status = BondStatus.MentorSigned;
        } else if (bond.learnerSigned && !bond.mentorSigned) {
            bond.status = BondStatus.LearnerSigned;
        }

        emit BondSigned(bondId, msg.sender, bond.mentorSigned, bond.learnerSigned);

        // ── Both signed → complete the bond ─────────────────────────────────
        if (bond.mentorSigned && bond.learnerSigned) {
            // Effects first — update all state before any external calls (CEI)
            bond.status = BondStatus.Completed;

            uint256 refund   = bond.stakeAmount;
            address learner  = bond.learner;
            address mentor   = bond.mentor;

            bond.stakeAmount = 0; // zero out before transfer — reentrancy guard

            emit BondCompleted(bondId, mentor, learner);

            // Interactions — ETH transfer then NFT mint (both external)
            (bool success, ) = learner.call{value: refund}("");
            require(success, "CoSigned: stake refund failed");

            _mintSoulboundNFTs(bondId);
        }
    }

    /**
     * @notice Internal — mints soulbound NFTs to both parties on bond completion.
     * @dev Placeholder until CoSignedNFT.sol is wired in on Day 10.
     *      Both tokens use the bond's ipfsHash as the metadata URI.
     *      TokenType differentiates LEARNER_PROOF vs MENTOR_PROOF in metadata.
     * @param bondId The completed bond ID.
     */
    function _mintSoulboundNFTs(uint256 bondId) internal {
        // Day 10: replace with real NFT contract calls
        // nftContract.mint(bonds[bondId].learner, TokenType.LEARNER_PROOF, bonds[bondId].ipfsHash);
        // nftContract.mint(bonds[bondId].mentor,  TokenType.MENTOR_PROOF,  bonds[bondId].ipfsHash);
        bondId; // suppress unused variable warning until Day 10
    }

    /**
     * @notice Either party raises a dispute after the bond deadline has passed.
     * @dev Only callable when status is Active — not on partially-signed bonds.
     *      Partially-signed bonds (MentorSigned/LearnerSigned) cannot be disputed;
     *      the other party should still sign. Post-MVP: add abandonBond() for this.
     *
     *      Edge case — simultaneous dispute:
     *        If both parties call in the same block, the first succeeds and sets
     *        status = Disputed. The second reverts because status is no longer Active.
     *        Outcome is identical either way — no special handling needed.
     *
     * @param bondId The ID of the bond to dispute.
     */
    function disputeBond(uint256 bondId) external {
        Bond storage bond = bonds[bondId];

        // ── Checks ──────────────────────────────────────────────────────────
        require(
            msg.sender == bond.mentor || msg.sender == bond.learner,
            "CoSigned: not a party to this bond"
        );
        require(bond.status == BondStatus.Active,       "CoSigned: bond must be active to dispute");
        require(block.timestamp > bond.deadline,        "CoSigned: deadline has not passed yet");

        // ── Effects ─────────────────────────────────────────────────────────
        bond.status          = BondStatus.Disputed;
        bond.disputeOpenedAt = block.timestamp;

        emit BondDisputed(bondId, msg.sender, block.timestamp);
    }

    /**
     * @notice Resolves a dispute after the 7-day window and refunds the learner's stake.
     * @dev Callable by ANYONE after the window — not just the parties.
     *      This prevents ETH being permanently locked if both parties disappear.
     *      Bond stays in Disputed state (terminal) — no NFTs are minted.
     *      Mentor receives nothing: no completion = no credential.
     *
     *      Implements CEI pattern:
     *        1. Check: status == Disputed, 7 days elapsed
     *        2. Effect: zero out stakeAmount
     *        3. Interact: transfer ETH to learner
     *
     * @param bondId The ID of the disputed bond to resolve.
     */
    function resolveDispute(uint256 bondId) external nonReentrant {
        Bond storage bond = bonds[bondId];

        // ── Checks ──────────────────────────────────────────────────────────
        require(bond.status == BondStatus.Disputed,                         "CoSigned: bond not in disputed state");
        require(block.timestamp >= bond.disputeOpenedAt + 7 days,           "CoSigned: dispute window still open");

        // ── Effects ─────────────────────────────────────────────────────────
        uint256 refund  = bond.stakeAmount;
        address learner = bond.learner;

        bond.stakeAmount = 0; // zero before transfer — reentrancy guard

        emit DisputeResolved(bondId, msg.sender, refund);

        // ── Interactions ─────────────────────────────────────────────────────
        (bool success, ) = learner.call{value: refund}("");
        require(success, "CoSigned: refund failed");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // VIEW FUNCTIONS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Returns the full Bond struct for a given bond ID.
     * @dev Returns a zero-value Bond if bondId doesn't exist.
     *      Frontend must check bond.id != 0 to confirm existence.
     * @param bondId The ID of the bond to retrieve.
     * @return The Bond struct.
     */
    function getBond(uint256 bondId) external view returns (Bond memory) {
        return bonds[bondId];
    }

    /**
     * @notice Returns all bond IDs associated with a given address (as mentor or learner).
     * @dev Concatenates mentorBonds and learnerBonds arrays.
     *      O(n) — acceptable for MVP. Use The Graph for scale.
     * @param user The wallet address to query.
     * @return Array of bond IDs.
     */
    function getBondsByAddress(address user) external view returns (uint256[] memory) {
        uint256[] memory mBonds = mentorBonds[user];
        uint256[] memory lBonds = learnerBonds[user];

        uint256 totalLen = mBonds.length + lBonds.length;
        uint256[] memory combined = new uint256[](totalLen);

        for (uint256 i = 0; i < mBonds.length; i++) {
            combined[i] = mBonds[i];
        }
        for (uint256 i = 0; i < lBonds.length; i++) {
            combined[mBonds.length + i] = lBonds[i];
        }

        return combined;
    }
}
