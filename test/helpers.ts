import hre, { ethers } from "hardhat";

export async function mineBlocks(times: number) {
  for (let i = 0; i < times; i++) {
    await hre.network.provider.send("evm_mine");
  }
}

export async function increaseBlockTime(time: number, mine: boolean = false) {
  await hre.network.provider.send("evm_increaseTime", [time]);

  if (mine) {
    await hre.network.provider.send("evm_mine");
  }
}

export async function changeBlockTime(time: number, mine: boolean = false) {
  await hre.network.provider.send("evm_setNextBlockTimestamp", [time]);

  if (mine) {
    await hre.network.provider.send("evm_mine");
  }
}

export async function getBlockTimestamp() {
  const blockNumBefore = await ethers.provider.getBlockNumber();
  const blockBefore = await ethers.provider.getBlock(blockNumBefore);
  const timestampBefore = blockBefore.timestamp;

  return timestampBefore;
}
