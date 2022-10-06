/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { Cash, CashInterface } from "../../contracts/Cash";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "Burned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "Minted",
    type: "event",
  },
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
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
        name: "_account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
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
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506111b7806100206000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c8063715018a6116100a25780639dc29fac116100715780639dc29fac14610223578063a457c2d714610236578063a9059cbb14610249578063dd62ed3e1461025c578063f2fde38b1461026f57600080fd5b8063715018a6146101f05780638129fc1c146101f85780638da5cb5b1461020057806395d89b411461021b57600080fd5b806323b872dd116100e957806323b872dd1461017d578063313ce56714610190578063395093511461019f57806340c10f19146101b257806370a08231146101c757600080fd5b806301ffc9a71461011b57806306fdde0314610143578063095ea7b31461015857806318160ddd1461016b575b600080fd5b61012e610129366004610f60565b610282565b60405190151581526020015b60405180910390f35b61014b6102b9565b60405161013a9190610f91565b61012e610166366004611002565b61034b565b6099545b60405190815260200161013a565b61012e61018b36600461102c565b610363565b6040516006815260200161013a565b61012e6101ad366004611002565b610387565b6101c56101c0366004611002565b6103a9565b005b61016f6101d5366004611068565b6001600160a01b031660009081526097602052604090205490565b6101c561044a565b6101c561045e565b6033546040516001600160a01b03909116815260200161013a565b61014b6105b6565b6101c5610231366004611002565b6105c5565b61012e610244366004611002565b610654565b61012e610257366004611002565b6106cf565b61016f61026a366004611083565b6106dd565b6101c561027d366004611068565b610708565b60006001600160e01b0319821663761fbae960e11b14806102b357506301ffc9a760e01b6001600160e01b03198316145b92915050565b6060609a80546102c8906110b6565b80601f01602080910402602001604051908101604052809291908181526020018280546102f4906110b6565b80156103415780601f1061031657610100808354040283529160200191610341565b820191906000526020600020905b81548152906001019060200180831161032457829003601f168201915b5050505050905090565b60003361035981858561077e565b5060019392505050565b6000336103718582856108a3565b61037c85858561091d565b506001949350505050565b60003361035981858561039a83836106dd565b6103a49190611107565b61077e565b6103b1610aeb565b80600081116103f85760405162461bcd60e51b815260206004820152600e60248201526d496e76616c69642076616c75652160901b60448201526064015b60405180910390fd5b6104028383610b45565b826001600160a01b03167f30385c845b448a36257a6a1716e6ad2e1bc2cbe333cde1e69fe849ad6511adfe8360405161043d91815260200190565b60405180910390a2505050565b610452610aeb565b61045c6000610c25565b565b600054610100900460ff161580801561047e5750600054600160ff909116105b806104985750303b158015610498575060005460ff166001145b6104fb5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084016103ef565b6000805460ff19166001179055801561051e576000805461ff0019166101001790555b61055d60405180604001604052806004815260200163086c2e6d60e31b815250604051806040016040528060018152602001604360f81b815250610c77565b610565610ca8565b61056d610cd7565b80156105b3576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50565b6060609b80546102c8906110b6565b6105cd610aeb565b806000811161060f5760405162461bcd60e51b815260206004820152600e60248201526d496e76616c69642076616c75652160901b60448201526064016103ef565b6106198383610cfe565b826001600160a01b03167f696de425f79f4a40bc6d2122ca50507f0efbeabbff86a84871b7196ab8ea8df78360405161043d91815260200190565b6000338161066282866106dd565b9050838110156106c25760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016103ef565b61037c828686840361077e565b60003361035981858561091d565b6001600160a01b03918216600090815260986020908152604080832093909416825291909152205490565b610710610aeb565b6001600160a01b0381166107755760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016103ef565b6105b381610c25565b6001600160a01b0383166107e05760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016103ef565b6001600160a01b0382166108415760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016103ef565b6001600160a01b0383811660008181526098602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b60006108af84846106dd565b90506000198114610917578181101561090a5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016103ef565b610917848484840361077e565b50505050565b6001600160a01b0383166109815760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016103ef565b6001600160a01b0382166109e35760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016103ef565b6001600160a01b03831660009081526097602052604090205481811015610a5b5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016103ef565b6001600160a01b03808516600090815260976020526040808220858503905591851681529081208054849290610a92908490611107565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610ade91815260200190565b60405180910390a3610917565b6033546001600160a01b0316331461045c5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016103ef565b6001600160a01b038216610b9b5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016103ef565b8060996000828254610bad9190611107565b90915550506001600160a01b03821660009081526097602052604081208054839290610bda908490611107565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35b5050565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600054610100900460ff16610c9e5760405162461bcd60e51b81526004016103ef9061111f565b610c218282610e49565b600054610100900460ff16610ccf5760405162461bcd60e51b81526004016103ef9061111f565b61045c610e97565b600054610100900460ff1661045c5760405162461bcd60e51b81526004016103ef9061111f565b6001600160a01b038216610d5e5760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016103ef565b6001600160a01b03821660009081526097602052604090205481811015610dd25760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b60648201526084016103ef565b6001600160a01b0383166000908152609760205260408120838303905560998054849290610e0190849061116a565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90602001610896565b505050565b600054610100900460ff16610e705760405162461bcd60e51b81526004016103ef9061111f565b8151610e8390609a906020850190610ec7565b508051610e4490609b906020840190610ec7565b600054610100900460ff16610ebe5760405162461bcd60e51b81526004016103ef9061111f565b61045c33610c25565b828054610ed3906110b6565b90600052602060002090601f016020900481019282610ef55760008555610f3b565b82601f10610f0e57805160ff1916838001178555610f3b565b82800160010185558215610f3b579182015b82811115610f3b578251825591602001919060010190610f20565b50610f47929150610f4b565b5090565b5b80821115610f475760008155600101610f4c565b600060208284031215610f7257600080fd5b81356001600160e01b031981168114610f8a57600080fd5b9392505050565b600060208083528351808285015260005b81811015610fbe57858101830151858201604001528201610fa2565b81811115610fd0576000604083870101525b50601f01601f1916929092016040019392505050565b80356001600160a01b0381168114610ffd57600080fd5b919050565b6000806040838503121561101557600080fd5b61101e83610fe6565b946020939093013593505050565b60008060006060848603121561104157600080fd5b61104a84610fe6565b925061105860208501610fe6565b9150604084013590509250925092565b60006020828403121561107a57600080fd5b610f8a82610fe6565b6000806040838503121561109657600080fd5b61109f83610fe6565b91506110ad60208401610fe6565b90509250929050565b600181811c908216806110ca57607f821691505b602082108114156110eb57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b6000821982111561111a5761111a6110f1565b500190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b60008282101561117c5761117c6110f1565b50039056fea2646970667358221220b31cf2edae589484cd4c25dbefd40b42006aaff076256b706bd9d04fe350419864736f6c63430008090033";

type CashConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CashConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Cash__factory extends ContractFactory {
  constructor(...args: CashConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Cash> {
    return super.deploy(overrides || {}) as Promise<Cash>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Cash {
    return super.attach(address) as Cash;
  }
  override connect(signer: Signer): Cash__factory {
    return super.connect(signer) as Cash__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CashInterface {
    return new utils.Interface(_abi) as CashInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Cash {
    return new Contract(address, _abi, signerOrProvider) as Cash;
  }
}
