import hre, { ethers, deployments } from "hardhat";

const ETH_USD_PRICE_FEED = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e";
const BTC_USD_PRICE_FEED = "0xECe365B379E1dD183B20fc5f022230C044d51404";
const DAI_USD_PRICE_FEED = "0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF";

const ETH_ADDRESS = "0xD186A3b0cE0f2E0F0A0332D4754eDCf453657ae7";
const BTC_ADDRESS = "0x0e363CfAb22281D30EBd9359272b43469CeF8247";
const DAI_ADDRESS = "0xB8041C8dFF4E368c8D4FA55a2e4d60898FF31994";

// ?: to run this file, "hh run scripts/main.ts --network <networkName>"
async function main() {
  const { get } = deployments;
  const [deployer, acc2] = await ethers.getSigners();
  const stakingDeployment = await get("Staking");

  let tx;

  const stakingContract = await ethers.getContractAt(
    "Staking",
    stakingDeployment.address,
    deployer
  );

  const owner = await stakingContract.owner();
  console.log(`Owner: ${owner}`);

  // await stakingContract.addAllowedToken(ETH_ADDRESS, ETH_USD_PRICE_FEED);
  // await stakingContract.addAllowedToken(BTC_ADDRESS, BTC_USD_PRICE_FEED);
  // eslint-disable-next-line prefer-const
  tx = await stakingContract.addAllowedToken(DAI_ADDRESS, DAI_USD_PRICE_FEED);
  tx.wait(1);

  const { price: ethPrice, decimals: ethDecimals } =
    await stakingContract.getTokenValue(ETH_ADDRESS);
  console.log(`Price of ETH=${ethPrice.toNumber() / 10 ** ethDecimals}`);

  const { price: btcPrice, decimals: btcDecimals } =
    await stakingContract.getTokenValue(BTC_ADDRESS);
  console.log(`Price of BTC=${btcPrice.toNumber() / 10 ** btcDecimals}`);

  const { price: daiPrice, decimals: daiDecimals } =
    await stakingContract.getTokenValue(DAI_ADDRESS);
  console.log(`Price of DAI=${daiPrice.toNumber() / 10 ** daiDecimals}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
