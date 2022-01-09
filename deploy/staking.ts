/* eslint-disable node/no-unpublished-import */
import { HardhatRuntimeEnvironment } from "hardhat/types";
// eslint-disable-next-line node/no-missing-import
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains } from "../helper-hardhat-config";
import { saveAbi, verify } from "../helpers";
import { ethers } from "hardhat";

const deployContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getChainId, getNamedAccounts, getUnnamedAccounts } = hre;
  const { deploy, log, get } = deployments;
  const [deployer, acc2] = await hre.ethers.getSigners(); // ?: this is basically a superior version of getNamedAccounts since there's more data

  const staking = await deploy("Staking", {
    from: deployer.address,
  });

  const stakingContractFactory = await hre.ethers.getContractFactory("Staking");
  const stakingContract = new ethers.Contract(
    staking.address,
    stakingContractFactory.interface,
    deployer
  );

  log(`Staking contract successfully deployed to ${staking.address}`);

  if (!developmentChains.includes(hre.network.name)) {
    saveAbi("Staking", hre.network.name);
    log("Backup Verification");
    log(
      `Verify with:\n npx hardhat verify --network ${hre.network.name} ${stakingContract.address}`
    );

    try {
      const result = await verify(staking.address, hre, []);
      if (result) log("Verification successful!");
    } catch (error) {
      console.log(error);
    }
  }
};

export default deployContract;
deployContract.tags = ["all", "staking"];
