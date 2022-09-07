import { ethers } from 'hardhat';

const VERIFY_SIG_ADDRESS = '0xC5e935C06D69C0C0D9C2502cC11d4eA83C69D284';
const BANNED_ADDRESS = '0x2798d52306AAfaDb4b51ebc6bBe63554E29f6951';

async function main() {
  const [deployer] = await ethers.getSigners();
  const verifySignature = await ethers.getContractAt(
    'SignatureVerify',
    VERIFY_SIG_ADDRESS,
    deployer,
  );
  const isUserBanned = await verifySignature.blacklistedUsers(BANNED_ADDRESS);
  await console.log(verifySignature.address, isUserBanned);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
