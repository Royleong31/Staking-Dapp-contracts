import dotenv from "dotenv";
import { getHDWallet } from "./helpers";

import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "solidity-coverage";
import "hardhat-deploy";
import "hardhat-gas-reporter";

import "@appliedblockchain/chainlink-plugins-fund-link";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: "0.8.11" },
      { version: "0.4.24" },
      { version: "0.6.6" },
    ], // ?: can include multiple compiler versions
  },

  defaultNetwork: "hardhat",

  networks: {
    hardhat: {
      // If you want to do some forking, uncomment this
      forking: {
        url: process.env.MAINNET_RPC_URL!,
      },
    },
    localhost: {
      // allowUnlimitedContractSize: true,
    },
    kovan: {
      url: process.env.KOVAN_RPC_URL,
      accounts: getHDWallet(),
      saveDeployments: true,
    },
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL,
      accounts: getHDWallet(),
      saveDeployments: true,
    },
    ganache: {
      url: "http://localhost:8545",
      accounts: getHDWallet(),
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL,
      accounts: getHDWallet(),
      saveDeployments: true,
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL,
      accounts: getHDWallet(),
      saveDeployments: true,
    },
    cronos_testnet: {
      url: "https://cronos-testnet-3.crypto.org:8545",
      accounts: getHDWallet(),
      saveDeployments: true,
    },
    cronos: {
      url: "https://evm-cronos.crypto.org",
      accounts: getHDWallet(),
      saveDeployments: true,
    },
    BSC: {
      url: "https://bsc-dataseed.binance.org/",
      accounts: getHDWallet(),
      saveDeployments: true,
    },
    fantom: {
      url: "https://rpc.ftm.tools/",
      accounts: getHDWallet(),
      saveDeployments: true,
    },
  },

  namedAccounts: {
    deployer: {
      default: 0, // ?: default refers to the default network
    },
    secondary: {
      default: 1,
    },
  },

  gasReporter: {
    enabled: true,
    gasPrice: 100,
    currency: "USD",
    outputFile: "gasReport.md",
    noColors: true,
    coinmarketcap: process.env.CMC_API_KEY,
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // ?: change to other network API key if not using ETH
  },
};

export default config;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });
