/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Staking, StakingInterface } from "../Staking";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "Received",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "staker",
        type: "address",
      },
    ],
    name: "StakeTokens",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "unstaker",
        type: "address",
      },
    ],
    name: "UnstakeTokens",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_oracleAddress",
        type: "address",
      },
    ],
    name: "addAllowedToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allowedTokens",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractEthBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_client",
        type: "address",
      },
    ],
    name: "getStakerIndex",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    name: "getTokenValue",
    outputs: [
      {
        internalType: "int256",
        name: "price",
        type: "int256",
      },
      {
        internalType: "uint8",
        name: "decimals",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    name: "getUserSingleTokenUSDValue",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserTotalUSDValue",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    name: "isTokenAllowed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "issueTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "numberOfAllowedTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "numberOfStakers",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rug",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "stakeTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "stakers",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "stakingBalances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    name: "tokenPriceFeed",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalStakingRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "uniqueTokensStaked",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "unstakeTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5062000032620000266200003860201b60201c565b6200004060201b60201c565b62000104565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b612a8880620001146000396000f3fe6080604052600436106101385760003560e01c80639878cbb3116100ab578063e89a173e1161006f578063e89a173e1461047f578063e9be02aa146104a8578063f1c5d6c2146104bf578063f2fde38b146104fd578063f9eaee0d14610526578063fd5e6dd11461056357610178565b80639878cbb314610360578063b4c438691461039d578063b83e0234146103c8578063d39d81fc14610405578063e41389121461044257610178565b80635eabf577116100fd5780635eabf5771461028857806360ab5852146102b3578063715018a6146102ca57806379a83f5a146102e15780638da5cb5b1461030a57806393ef357a1461033557610178565b8062ca8af71461017d578063276cc718146101ba578063305e94cd146101f75780635d58ce36146102205780635e5f2e261461024b57610178565b36610178577f88a5966d370b9919b20f3e2c13ff65706f196a4e32cc2c12bf57088f88525874333460405161016e929190611ccb565b60405180910390a1005b600080fd5b34801561018957600080fd5b506101a4600480360381019061019f9190611d25565b6105a0565b6040516101b19190611d6b565b60405180910390f35b3480156101c657600080fd5b506101e160048036038101906101dc9190611d86565b61066d565b6040516101ee9190611dc6565b60405180910390f35b34801561020357600080fd5b5061021e60048036038101906102199190611e1f565b610817565b005b34801561022c57600080fd5b50610235610986565b6040516102429190611dc6565b60405180910390f35b34801561025757600080fd5b50610272600480360381019061026d9190611e8b565b61098e565b60405161027f9190611f17565b60405180910390f35b34801561029457600080fd5b5061029d6109cd565b6040516102aa9190611dc6565b60405180910390f35b3480156102bf57600080fd5b506102c86109da565b005b3480156102d657600080fd5b506102df610b41565b005b3480156102ed57600080fd5b5061030860048036038101906103039190611f32565b610bc9565b005b34801561031657600080fd5b5061031f610f49565b60405161032c9190611f72565b60405180910390f35b34801561034157600080fd5b5061034a610f72565b6040516103579190611dc6565b60405180910390f35b34801561036c57600080fd5b5061038760048036038101906103829190611f8d565b610ff8565b6040516103949190611f72565b60405180910390f35b3480156103a957600080fd5b506103b261102b565b6040516103bf9190611dc6565b60405180910390f35b3480156103d457600080fd5b506103ef60048036038101906103ea9190611d25565b611038565b6040516103fc9190611dc6565b60405180910390f35b34801561041157600080fd5b5061042c60048036038101906104279190611e1f565b611050565b6040516104399190611dc6565b60405180910390f35b34801561044e57600080fd5b5061046960048036038101906104649190611d25565b611075565b6040516104769190611dc6565b60405180910390f35b34801561048b57600080fd5b506104a660048036038101906104a19190611f32565b61114b565b005b3480156104b457600080fd5b506104bd611671565b005b3480156104cb57600080fd5b506104e660048036038101906104e19190611f8d565b61171f565b6040516104f4929190611fd6565b60405180910390f35b34801561050957600080fd5b50610524600480360381019061051f9190611d25565b6118cb565b005b34801561053257600080fd5b5061054d60048036038101906105489190611f8d565b6119c3565b60405161055a919061201a565b60405180910390f35b34801561056f57600080fd5b5061058a60048036038101906105859190611e8b565b611a72565b6040516105979190611f72565b60405180910390f35b600080600090505b600480549050811015610643578273ffffffffffffffffffffffffffffffffffffffff16600482815481106105e0576105df612035565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156106305780915050610668565b808061063b90612093565b9150506105a8565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90505b919050565b600081610679816119c3565b6106b8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106af90612139565b60405180910390fd5b6000600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050600081141561074c576000925050610810565b60008473ffffffffffffffffffffffffffffffffffffffff1663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610799573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107bd9190612185565b90506000806107cb8761171f565b9150915082600a6107dc91906122e5565b81600a6107e991906122e5565b85846107f59190612330565b6107ff91906123b9565b61080991906123b9565b9550505050505b5092915050565b61081f611ab1565b73ffffffffffffffffffffffffffffffffffffffff1661083d610f49565b73ffffffffffffffffffffffffffffffffffffffff1614610893576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161088a90612436565b60405180910390fd5b61089c826119c3565b610904576005829080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b80600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b600047905090565b6005818154811061099e57600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600480549050905090565b6109e2611ab1565b73ffffffffffffffffffffffffffffffffffffffff16610a00610f49565b73ffffffffffffffffffffffffffffffffffffffff1614610a56576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a4d90612436565b60405180910390fd5b610a5e610f72565b471015610aa0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a97906124c8565b60405180910390fd5b60005b600480549050811015610b3e57600060048281548110610ac657610ac5612035565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506000610afe82611075565b9050610b29818373ffffffffffffffffffffffffffffffffffffffff16611ab990919063ffffffff16565b50508080610b3690612093565b915050610aa3565b50565b610b49611ab1565b73ffffffffffffffffffffffffffffffffffffffff16610b67610f49565b73ffffffffffffffffffffffffffffffffffffffff1614610bbd576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bb490612436565b60405180910390fd5b610bc76000611bad565b565b81610bd3816119c3565b610c12576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c0990612139565b60405180910390fd5b60008211610c55576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c4c9061255a565b60405180910390fd5b8273ffffffffffffffffffffffffffffffffffffffff166323b872dd610c79611ab1565b30856040518463ffffffff1660e01b8152600401610c999392919061257a565b6020604051808303816000875af1158015610cb8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cdc91906125dd565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff610d0e610d09611ab1565b6105a0565b1415610d7f576004610d1e611ab1565b9080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b6000600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000610dca611ab1565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415610e6a57600160026000610e19611ab1565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610e62919061260a565b925050819055505b81600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000610eb4611ab1565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610efd919061260a565b925050819055507ff14d2994a20e98fdd02a2ac1f7896452e35eaa259edf81fd538719fc468467e983610f2e611ab1565b604051610f3c929190612660565b60405180910390a1505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000806000905060005b600480549050811015610ff057610fd060048281548110610fa057610f9f612035565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16611075565b82610fdb919061260a565b91508080610fe890612093565b915050610f7c565b508091505090565b60036020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600580549050905090565b60026020528060005260406000206000915090505481565b6001602052816000526040600020602052806000526040600020600091509150505481565b600080600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414156110c75760009050611146565b6000805b6005805490508110156111405761112084600583815481106110f0576110ef612035565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1661066d565b8261112b919061260a565b9150808061113890612093565b9150506110cb565b50809150505b919050565b81611155816119c3565b611194576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161118b90612139565b60405180910390fd5b600082116111d7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111ce9061255a565b60405180910390fd5b81600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000611221611ab1565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101561129d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611294906126fb565b60405180910390fd5b81600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006112e7611ab1565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611330919061271b565b925050819055506000600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000611382611ab1565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415611422576001600260006113d1611ab1565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461141a919061271b565b925050819055505b600061143461142f611ab1565b6105a0565b9050600060026000611444611ab1565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541480156114ac57507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114155b156115a557600460016004805490506114c5919061271b565b815481106114d6576114d5612035565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166004828154811061151557611514612035565b5b9060005260206000200160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600480548061156f5761156e61274f565b5b6001900381819060005260206000200160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905590555b8373ffffffffffffffffffffffffffffffffffffffff1663a9059cbb6115c9611ab1565b856040518363ffffffff1660e01b81526004016115e7929190611ccb565b6020604051808303816000875af1158015611606573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061162a91906125dd565b507f78257e7eff37632fc168bca0ce90d96440f519d6f6873dd0b345a8a9df37da8884611655611ab1565b604051611663929190612660565b60405180910390a150505050565b611679611ab1565b73ffffffffffffffffffffffffffffffffffffffff16611697610f49565b73ffffffffffffffffffffffffffffffffffffffff16146116ed576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016116e490612436565b60405180910390fd5b61171d476116f9610f49565b73ffffffffffffffffffffffffffffffffffffffff16611ab990919063ffffffff16565b565b6000808261172c816119c3565b61176b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161176290612139565b60405180910390fd5b6000600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905060008190508073ffffffffffffffffffffffffffffffffffffffff1663feaf968c6040518163ffffffff1660e01b815260040160a060405180830381865afa15801561181f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118439190612801565b9091929350909150905050809550508073ffffffffffffffffffffffffffffffffffffffff1663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa15801561189d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118c19190612185565b9350505050915091565b6118d3611ab1565b73ffffffffffffffffffffffffffffffffffffffff166118f1610f49565b73ffffffffffffffffffffffffffffffffffffffff1614611947576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161193e90612436565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156119b7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016119ae906128ee565b60405180910390fd5b6119c081611bad565b50565b600080600090505b600580549050811015611a6757600581815481106119ec576119eb612035565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611a54576001915050611a6d565b8080611a5f90612093565b9150506119cb565b50600090505b919050565b60048181548110611a8257600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600033905090565b80471015611afc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611af39061295a565b60405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff1682604051611b22906129ab565b60006040518083038185875af1925050503d8060008114611b5f576040519150601f19603f3d011682016040523d82523d6000602084013e611b64565b606091505b5050905080611ba8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611b9f90612a32565b60405180910390fd5b505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611c9c82611c71565b9050919050565b611cac81611c91565b82525050565b6000819050919050565b611cc581611cb2565b82525050565b6000604082019050611ce06000830185611ca3565b611ced6020830184611cbc565b9392505050565b600080fd5b611d0281611c91565b8114611d0d57600080fd5b50565b600081359050611d1f81611cf9565b92915050565b600060208284031215611d3b57611d3a611cf4565b5b6000611d4984828501611d10565b91505092915050565b6000819050919050565b611d6581611d52565b82525050565b6000602082019050611d806000830184611d5c565b92915050565b60008060408385031215611d9d57611d9c611cf4565b5b6000611dab85828601611d10565b9250506020611dbc85828601611d10565b9150509250929050565b6000602082019050611ddb6000830184611cbc565b92915050565b6000611dec82611c91565b9050919050565b611dfc81611de1565b8114611e0757600080fd5b50565b600081359050611e1981611df3565b92915050565b60008060408385031215611e3657611e35611cf4565b5b6000611e4485828601611e0a565b9250506020611e5585828601611d10565b9150509250929050565b611e6881611cb2565b8114611e7357600080fd5b50565b600081359050611e8581611e5f565b92915050565b600060208284031215611ea157611ea0611cf4565b5b6000611eaf84828501611e76565b91505092915050565b6000819050919050565b6000611edd611ed8611ed384611c71565b611eb8565b611c71565b9050919050565b6000611eef82611ec2565b9050919050565b6000611f0182611ee4565b9050919050565b611f1181611ef6565b82525050565b6000602082019050611f2c6000830184611f08565b92915050565b60008060408385031215611f4957611f48611cf4565b5b6000611f5785828601611e0a565b9250506020611f6885828601611e76565b9150509250929050565b6000602082019050611f876000830184611ca3565b92915050565b600060208284031215611fa357611fa2611cf4565b5b6000611fb184828501611e0a565b91505092915050565b600060ff82169050919050565b611fd081611fba565b82525050565b6000604082019050611feb6000830185611d5c565b611ff86020830184611fc7565b9392505050565b60008115159050919050565b61201481611fff565b82525050565b600060208201905061202f600083018461200b565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061209e82611cb2565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156120d1576120d0612064565b5b600182019050919050565b600082825260208201905092915050565b7f546f6b656e206973206e6f7420616c6c6f776564000000000000000000000000600082015250565b60006121236014836120dc565b915061212e826120ed565b602082019050919050565b6000602082019050818103600083015261215281612116565b9050919050565b61216281611fba565b811461216d57600080fd5b50565b60008151905061217f81612159565b92915050565b60006020828403121561219b5761219a611cf4565b5b60006121a984828501612170565b91505092915050565b60008160011c9050919050565b6000808291508390505b6001851115612209578086048111156121e5576121e4612064565b5b60018516156121f45780820291505b8081029050612202856121b2565b94506121c9565b94509492505050565b60008261222257600190506122de565b8161223057600090506122de565b816001811461224657600281146122505761227f565b60019150506122de565b60ff84111561226257612261612064565b5b8360020a91508482111561227957612278612064565b5b506122de565b5060208310610133831016604e8410600b84101617156122b45782820a9050838111156122af576122ae612064565b5b6122de565b6122c184848460016121bf565b925090508184048111156122d8576122d7612064565b5b81810290505b9392505050565b60006122f082611cb2565b91506122fb83611fba565b92506123287fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8484612212565b905092915050565b600061233b82611cb2565b915061234683611cb2565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561237f5761237e612064565b5b828202905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60006123c482611cb2565b91506123cf83611cb2565b9250826123df576123de61238a565b5b828204905092915050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b60006124206020836120dc565b915061242b826123ea565b602082019050919050565b6000602082019050818103600083015261244f81612413565b9050919050565b7f436f6e74726163742068617320696e73756666696369656e742045544820666f60008201527f7220746f6b656e2069737375616e636500000000000000000000000000000000602082015250565b60006124b26030836120dc565b91506124bd82612456565b604082019050919050565b600060208201905081810360008301526124e1816124a5565b9050919050565b7f5374616b696e6720616d6f756e74206d7573742062652067726561746572207460008201527f68616e2030000000000000000000000000000000000000000000000000000000602082015250565b60006125446025836120dc565b915061254f826124e8565b604082019050919050565b6000602082019050818103600083015261257381612537565b9050919050565b600060608201905061258f6000830186611ca3565b61259c6020830185611ca3565b6125a96040830184611cbc565b949350505050565b6125ba81611fff565b81146125c557600080fd5b50565b6000815190506125d7816125b1565b92915050565b6000602082840312156125f3576125f2611cf4565b5b6000612601848285016125c8565b91505092915050565b600061261582611cb2565b915061262083611cb2565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561265557612654612064565b5b828201905092915050565b60006040820190506126756000830185611f08565b6126826020830184611ca3565b9392505050565b7f5374616b65642062616c616e6365206973206c6f776572207468616e20756e7360008201527f74616b696e6720616d6f756e7400000000000000000000000000000000000000602082015250565b60006126e5602d836120dc565b91506126f082612689565b604082019050919050565b60006020820190508181036000830152612714816126d8565b9050919050565b600061272682611cb2565b915061273183611cb2565b92508282101561274457612743612064565b5b828203905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fd5b600069ffffffffffffffffffff82169050919050565b61279d8161277e565b81146127a857600080fd5b50565b6000815190506127ba81612794565b92915050565b6127c981611d52565b81146127d457600080fd5b50565b6000815190506127e6816127c0565b92915050565b6000815190506127fb81611e5f565b92915050565b600080600080600060a0868803121561281d5761281c611cf4565b5b600061282b888289016127ab565b955050602061283c888289016127d7565b945050604061284d888289016127ec565b935050606061285e888289016127ec565b925050608061286f888289016127ab565b9150509295509295909350565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b60006128d86026836120dc565b91506128e38261287c565b604082019050919050565b60006020820190508181036000830152612907816128cb565b9050919050565b7f416464726573733a20696e73756666696369656e742062616c616e6365000000600082015250565b6000612944601d836120dc565b915061294f8261290e565b602082019050919050565b6000602082019050818103600083015261297381612937565b9050919050565b600081905092915050565b50565b600061299560008361297a565b91506129a082612985565b600082019050919050565b60006129b682612988565b9150819050919050565b7f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260008201527f6563697069656e74206d61792068617665207265766572746564000000000000602082015250565b6000612a1c603a836120dc565b9150612a27826129c0565b604082019050919050565b60006020820190508181036000830152612a4b81612a0f565b905091905056fea26469706673582212206d62ec944668c5ad90461e4befda777439e46de17eb96c9add73e03f1cce1cf464736f6c634300080b0033";

export class Staking__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Staking> {
    return super.deploy(overrides || {}) as Promise<Staking>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Staking {
    return super.attach(address) as Staking;
  }
  connect(signer: Signer): Staking__factory {
    return super.connect(signer) as Staking__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): StakingInterface {
    return new utils.Interface(_abi) as StakingInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Staking {
    return new Contract(address, _abi, signerOrProvider) as Staking;
  }
}
