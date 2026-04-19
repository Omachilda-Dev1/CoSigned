/**
 * copy-abis.js
 * Copies compiled ABIs from artifacts/ into frontend/lib/abi/
 * Run after every compile: node scripts/copy-abis.js
 */

const fs   = require("fs");
const path = require("path");

const artifacts = [
  {
    src:  "artifacts/contracts/CoSigned.sol/CoSigned.json",
    dest: "frontend/lib/abi/CoSigned.json",
  },
  {
    src:  "artifacts/contracts/CoSignedNFT.sol/CoSignedNFT.json",
    dest: "frontend/lib/abi/CoSignedNFT.json",
  },
];

const abiDir = path.join(__dirname, "..", "frontend", "lib", "abi");
if (!fs.existsSync(abiDir)) {
  fs.mkdirSync(abiDir, { recursive: true });
}

for (const { src, dest } of artifacts) {
  const srcPath  = path.join(__dirname, "..", src);
  const destPath = path.join(__dirname, "..", dest);

  if (!fs.existsSync(srcPath)) {
    console.error(`✗ Not found: ${src} — run npx hardhat compile first`);
    process.exit(1);
  }

  const artifact = JSON.parse(fs.readFileSync(srcPath, "utf8"));

  // Write only the ABI array (not the full artifact with bytecode)
  fs.writeFileSync(destPath, JSON.stringify(artifact.abi, null, 2));
  console.log(`✓ Copied ABI: ${dest}`);
}

console.log("\nDone. Update frontend/lib/contract.ts with deployed addresses.");
