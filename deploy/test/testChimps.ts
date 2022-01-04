/* eslint-disable node/no-unpublished-import */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { networkConfig, developmentChains } from "../../helper-hardhat-config";
import { verify, chimpsArgs, testingChimpsArgs } from "../../helpers";

// ?: This file is used to deploy a Chimps contract for testing. It has a smaller max mint supply and cheaper minting costs

const deployTestContract: DeployFunction = async function (hre: any) {
  // ?: should be HardhatRuntimeEnvironment, but types injected by hardhat-deploy don't work here
  if (!developmentChains.includes(hre.network.name)) return;

  const { deployments } = hre;
  const { deploy, log } = deployments;
  const [deployer] = await hre.ethers.getSigners(); // ?: this is basically a superior version of getNamedAccounts since there's more data

  const chimps = await deploy("Chimps", {
    from: deployer.address,
    args: testingChimpsArgs,
  });

  log(`Contract successfully deployed to ${chimps.address}`);
};

export default deployTestContract;
deployTestContract.tags = ["all", "testing"];
