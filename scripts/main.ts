import hre, {
  ethers,
  deployments,
  run,
  network,
  getChainId,
  fundLink,
} from "hardhat";
import { networkConfig } from "../helper-hardhat-config";

// ?: to run this file, "hh run scripts/main.ts --network <networkName>"
async function main() {
  const { get } = deployments;
  const [deployer, acc2] = await ethers.getSigners();
  const oracleDeployment = await get("Oracle");
  const oracleContractFactory = await ethers.getContractFactory("Oracle");
  const chainId = await getChainId();
  let tx;

  const oracleContract = new ethers.Contract(
    oracleDeployment.address,
    oracleContractFactory.interface,
    deployer
  );

  const ethUsdPrice = await oracleContract.getEthPriceInUsd();

  console.log(`Price of ETH/USD: ${ethUsdPrice}`);

  // const linkContractFactory = await ethers.getContractFactory("LinkToken");
  // const linkContract = new ethers.Contract(
  //   networkConfig[chainId].linkToken!,
  //   linkContractFactory.interface,
  //   deployer
  // );

  // let tx = await linkContract.transfer(
  //   oracleContract.address,
  //   networkConfig[chainId].fee
  // );
  // tx.wait(1);

  // ?: fundLink() below from 'hardhat' does the same thing as the code above
  await fundLink(
    hre,
    oracleContract.address,
    networkConfig[chainId].fee,
    networkConfig[chainId].linkToken
  );

  await console.log("Successfully transferred");

  // eslint-disable-next-line prefer-const
  tx = await oracleContract.getRandomNumber();
  const receipt = await tx.wait();
  console.log(receipt.events[receipt.events.length - 1].args);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
