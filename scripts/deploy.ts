// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from 'hardhat';

const BANNED_ADDRESS = '0xdA0Fb2305EEad572fEAe4ee8C058C75760D49154';

async function main() {
  const [deployer] = await ethers.getSigners();
  const factory = await ethers.getContractFactory('SignatureVerify', deployer);
  const verifySignature = await (await factory.deploy()).deployed();
  await (await verifySignature.addBlacklistedContract(BANNED_ADDRESS)).wait();
  await console.log(verifySignature.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
