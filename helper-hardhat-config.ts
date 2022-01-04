/* DESCRIPTION
- linkToken, fee, keyHash and vrfCoordinator are used for Chainlink price feeds
- ethUsdPriceFeed is oracle address
*/

export interface networkConfigItem {
  name: string;
  ethUsdPriceFeed?: string;
  keyHash?: string;
  fee?: string;
  linkToken?: string;
  vrfCoordinator?: string;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  default: {
    name: "hardhat",
    fee: "100000000000000000",
    keyHash:
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
  },

  1: {
    name: "mainnet",
    linkToken: "0x514910771af9ca656af840dff83e8264ecf986ca",
    keyHash:
      "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445",
    vrfCoordinator: "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952",
    fee: "2000000000000000000",
  },

  4: {
    name: "rinkeby",
    linkToken: "0x01be23585060835e02b77ef475b0cc51aa1e0709",
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    keyHash:
      "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
    vrfCoordinator: "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B",
    fee: "100000000000000000",
  },

  42: {
    name: "kovan",
    linkToken: "0xa36085F69e2889c224210F603D836748e7dC0088",
    ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    keyHash:
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
    vrfCoordinator: "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
    fee: "100000000000000000",
  },

  56: {
    name: "BSC",
    linkToken: "0x404460C6A5EdE2D891e8297795264fDe62ADBB75",
    ethUsdPriceFeed: "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",
    keyHash:
      "0xc251acd21ec4fb7f31bb8868288bfdbaeb4fbfec2df3735ddbd4f7dc8d60103c",
    vrfCoordinator: "0x747973a5A2a4Ae1D3a8fDF5479f1514F65Db9C31",
    fee: "200000000000000000",
  },

  137: {
    name: "polygon",
    linkToken: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
    keyHash:
      "0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da",
    ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    vrfCoordinator: "0x3d2341ADb2D31f1c5530cDC622016af293177AE0",
    fee: "100000000000000",
  },

  31337: {
    name: "localhost",
    linkToken: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
    keyHash:
      "0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da",
    ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    vrfCoordinator: "0x3d2341ADb2D31f1c5530cDC622016af293177AE0",
    fee: "100000000000000",
  },

  25: {
    name: "cronos",
  },

  250: {
    name: "fantom",
  },

  338: {
    name: "cronos_testnet",
  },
};

export const developmentChains = ["hardhat", "localhost", "mainnet-fork"];

export const getNetworkIdFromName = async (networkIdName: string) => {
  for (const id in networkConfig) {
    if (networkConfig[id].name === networkIdName) {
      return id;
    }
  }
  return null;
};
