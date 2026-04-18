const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Deploy script for CoSigned protocol.
 *
 * CoSigned deploys CoSignedNFT internally in its constructor —
 * so only one deployment transaction is needed.
 *
 * Usage:
 *   Local:   npx hardhat run scripts/deploy.js
 *   Testnet: npx hardhat run scripts/deploy.js --network baseSepolia
 */
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("\n═══════════════════════════════════════════");
  console.log("  CoSigned — Deployment");
  console.log("═══════════════════════════════════════════");
  console.log(`  Network:  ${network.name}`);
  console.log(`  Deployer: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`  Balance:  ${ethers.formatEther(balance)} ETH`);
  console.log("───────────────────────────────────────────\n");

  // ── Deploy CoSigned ────────────────────────────────────────────────────────
  // CoSigned constructor deploys CoSignedNFT internally and stores its address.
  console.log("Deploying CoSigned...");
  const CoSigned = await ethers.getContractFactory("CoSigned");
  const cosigned = await CoSigned.deploy();
  await cosigned.waitForDeployment();

  const cosignedAddress = await cosigned.getAddress();
  console.log(`✓ CoSigned deployed:    ${cosignedAddress}`);

  // ── Retrieve CoSignedNFT address ───────────────────────────────────────────
  const nftAddress = await cosigned.nftContract();
  console.log(`✓ CoSignedNFT deployed: ${nftAddress}`);
  console.log("  (deployed by CoSigned constructor)\n");

  // ── Save addresses to deployments.json ────────────────────────────────────
  const deploymentsPath = path.join(__dirname, "..", "deployments.json");
  let deployments = {};

  if (fs.existsSync(deploymentsPath)) {
    deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));
  }

  deployments[network.name] = {
    CoSigned:    cosignedAddress,
    CoSignedNFT: nftAddress,
    deployedAt:  new Date().toISOString(),
    deployer:    deployer.address,
  };

  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
  console.log(`✓ Addresses saved to deployments.json`);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log("\n═══════════════════════════════════════════");
  console.log("  Deployment Complete");
  console.log("═══════════════════════════════════════════");
  console.log(`  CoSigned:    ${cosignedAddress}`);
  console.log(`  CoSignedNFT: ${nftAddress}`);

  if (network.name === "baseSepolia") {
    console.log(`\n  BaseScan: https://sepolia.basescan.org/address/${cosignedAddress}`);
    console.log(`\n  Verify contracts:`);
    console.log(`  npx hardhat verify --network baseSepolia ${cosignedAddress}`);
    console.log(`  npx hardhat verify --network baseSepolia ${nftAddress} "${cosignedAddress}"`);
  }

  console.log("═══════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
