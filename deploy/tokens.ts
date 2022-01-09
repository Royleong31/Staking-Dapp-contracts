/* eslint-disable node/no-unpublished-import */
import { HardhatRuntimeEnvironment } from "hardhat/types";
// eslint-disable-next-line node/no-missing-import
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains } from "../helper-hardhat-config";
import { verify, saveAbi } from "../helpers";
import { ethers } from "ethers";

const deployContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments } = hre;
  const { deploy, log, get } = deployments;
  const [deployer, acc2] = await hre.ethers.getSigners(); // ?: this is basically a superior version of getNamedAccounts since there's more data

  const bitcoin = await deploy("Bitcoin", {
    from: deployer.address,
  });

  const dai = await deploy("Dai", {
    from: deployer.address,
  });

  const ether = await deploy("Ether", {
    from: deployer.address,
  });

  const bitcoinContractFactory = await hre.ethers.getContractFactory("Bitcoin");
  const bitcoinContract = new ethers.Contract(
    bitcoin.address,
    bitcoinContractFactory.interface,
    deployer
  );
  log(`Bitcoin contract successfully deployed to ${bitcoin.address}`);

  const etherContractFactory = await hre.ethers.getContractFactory("Ether");
  const etherContract = new ethers.Contract(
    ether.address,
    etherContractFactory.interface,
    deployer
  );
  log(`ether contract successfully deployed to ${ether.address}`);

  const daiContractFactory = await hre.ethers.getContractFactory("Dai");
  const daiContract = new ethers.Contract(
    dai.address,
    daiContractFactory.interface,
    deployer
  );
  log(`dai contract successfully deployed to ${dai.address}`);

  if (!developmentChains.includes(hre.network.name)) {
    log("Backup Verification");
    log(
      `Verify with:\n npx hardhat verify --network ${hre.network.name} ${bitcoinContract.address}`
    );
    log(
      `Verify with:\n npx hardhat verify --network ${hre.network.name} ${etherContract.address}`
    );
    log(
      `Verify with:\n npx hardhat verify --network ${hre.network.name} ${daiContract.address}`
    );

    saveAbi("Bitcoin", hre.network.name);
    saveAbi("Ether", hre.network.name);
    saveAbi("Dai", hre.network.name);

    try {
      await verify(bitcoin.address, hre, []);
    } catch (error) {
      console.log(error);
    }

    try {
      await verify(ether.address, hre, []);
    } catch (error) {
      console.log(error);
    }

    try {
      await verify(dai.address, hre, []);
    } catch (error) {
      console.log(error);
    }
  }
};

export default deployContract;
deployContract.tags = ["all", "tokens"];
