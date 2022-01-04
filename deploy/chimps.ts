/* eslint-disable node/no-unpublished-import */
import { HardhatRuntimeEnvironment } from "hardhat/types";
// eslint-disable-next-line node/no-missing-import
import { DeployFunction } from "hardhat-deploy/types";
import { networkConfig, developmentChains } from "../helper-hardhat-config";
import { verify, chimpsArgs } from "../helpers";
import { ethers } from "ethers";

const deployContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getChainId, getNamedAccounts, getUnnamedAccounts } = hre;
  const { deploy, log, get } = deployments;
  const [deployer, acc2] = await hre.ethers.getSigners(); // ?: this is basically a superior version of getNamedAccounts since there's more data

  const chimps = await deploy("Chimps", {
    from: deployer.address,
    args: chimpsArgs,
  });

  const chimpsContractFactory = await hre.ethers.getContractFactory("Chimps");
  const chimpsContract = new ethers.Contract(
    chimps.address,
    chimpsContractFactory.interface,
    deployer
  );

  log(`Contract successfully deployed to ${chimps.address}`);

  if (!developmentChains.includes(hre.network.name)) {
    log("Backup Verification");
    log(
      `Verify with:\n npx hardhat verify --network ${hre.network.name} ${
        chimpsContract.address
      } ${chimpsArgs.toString().replace(/,/g, " ")}`
    );

    const result = await verify(chimps.address, hre, chimpsArgs);
    if (result) log("Verification successful!");
  }
};

export default deployContract;
deployContract.tags = ["all", "chimps"];
