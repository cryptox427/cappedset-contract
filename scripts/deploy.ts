import { ethers } from "hardhat";
const _numElements = 100;

async function main() {
  const CappedSet = await ethers.getContractFactory("CappedSet");
  const cappedSet = await CappedSet.deploy(_numElements);

  await cappedSet.deployed();

  console.log(
    `Contract Address ------- ${cappedSet.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
