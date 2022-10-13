/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  TicketManager,
  TicketManagerInterface,
} from "../../contracts/TicketManager";

const _abi = [
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
        name: "_times",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_ticketId",
        type: "uint256",
      },
    ],
    name: "Bought",
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
        name: "_times",
        type: "uint256",
      },
    ],
    name: "ExtendedTicket",
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
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "SetPricePerTime",
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
        name: "_remainTimes",
        type: "uint256",
      },
    ],
    name: "SubTractedTimes",
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
        indexed: true,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "WithdrawnToDeployer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_times",
        type: "uint256",
      },
    ],
    name: "buy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "cashManager",
    outputs: [
      {
        internalType: "contract ICashManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deployer",
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
        internalType: "uint256",
        name: "_times",
        type: "uint256",
      },
    ],
    name: "extendTicket",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "getTicketOf",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "ticketId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "times",
            type: "uint256",
          },
        ],
        internalType: "struct UserTicket",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ITicket",
        name: "_ticketAddress",
        type: "address",
      },
      {
        internalType: "contract ICashManager",
        name: "_cashManagerAddress",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "lastTicket",
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
    name: "pricePerTime",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newPrice",
        type: "uint256",
      },
    ],
    name: "setPricePerTime",
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
    ],
    name: "subtractTimes",
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
    name: "ticket",
    outputs: [
      {
        internalType: "contract ITicket",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "ticketOf",
    outputs: [
      {
        internalType: "uint256",
        name: "ticketId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "times",
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
    inputs: [],
    name: "withdrawToDeployer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611283806100206000396000f3fe6080604052600436106100fe5760003560e01c8063715018a611610095578063d5f3948811610064578063d5f3948814610317578063d848f99114610337578063d96a094a14610357578063e2d208911461036a578063f2fde38b1461038057600080fd5b8063715018a6146102775780638da5cb5b1461028c578063903fe15f146102aa578063d08150b2146102f357600080fd5b8063485cc955116100d1578063485cc955146102025780634bbb461c1461022257806350662e67146102375780636cc25db71461025757600080fd5b806301ffc9a7146101035780630412f4ab146101385780631cf90523146101b557806336d41c87146101ca575b600080fd5b34801561010f57600080fd5b5061012361011e36600461109a565b6103a0565b60405190151581526020015b60405180910390f35b34801561014457600080fd5b5061019a6101533660046110d9565b6040805180820190915260008082526020820152506001600160a01b03166000908152609c6020908152604091829020825180840190935280548352600101549082015290565b6040805182518152602092830151928101929092520161012f565b6101c86101c33660046110f6565b6103d7565b005b3480156101d657600080fd5b506098546101ea906001600160a01b031681565b6040516001600160a01b03909116815260200161012f565b34801561020e57600080fd5b506101c861021d36600461110f565b610580565b34801561022e57600080fd5b506101c861081d565b34801561024357600080fd5b506101c86102523660046110f6565b6108c2565b34801561026357600080fd5b506097546101ea906001600160a01b031681565b34801561028357600080fd5b506101c8610957565b34801561029857600080fd5b506033546001600160a01b03166101ea565b3480156102b657600080fd5b506102de6102c53660046110d9565b609c602052600090815260409020805460019091015482565b6040805192835260208301919091520161012f565b3480156102ff57600080fd5b50610309609a5481565b60405190815260200161012f565b34801561032357600080fd5b506099546101ea906001600160a01b031681565b34801561034357600080fd5b506101c86103523660046110d9565b61096b565b6101c86103653660046110f6565b610b21565b34801561037657600080fd5b50610309609b5481565b34801561038c57600080fd5b506101c861039b3660046110d9565b610cf7565b60006001600160e01b031982166319c9015360e01b14806103d157506301ffc9a760e01b6001600160e01b03198316145b92915050565b806000811161041e5760405162461bcd60e51b815260206004820152600e60248201526d496e76616c69642074696d65732160901b60448201526064015b60405180910390fd5b80609b5461042c919061115e565b34146104695760405162461bcd60e51b815260206004820152600c60248201526b496e76616c6964206665652160a01b6044820152606401610415565b33806104aa5760405162461bcd60e51b815260206004820152601060248201526f496e76616c696420616464726573732160801b6044820152606401610415565b6001600160a01b0381166000908152609c6020908152604091829020825180840190935280548084526001909101549183019190915261051e5760405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964207469636b65742160881b6044820152606401610415565b336000908152609c60205260408120600101805486929061054090849061117d565b909155505060405184815233907f857c2e2504f1791306e6c7f5bfed2bc57c7aee4d04c662e5ff1a99db34a0f0579060200160405180910390a250505050565b600054610100900460ff16158080156105a05750600054600160ff909116105b806105ba5750303b1580156105ba575060005460ff166001145b61061d5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610415565b6000805460ff191660011790558015610640576000805461ff0019166101001790555b610648610d70565b610650610d9f565b610661836340c10f1960e01b610dc6565b6106ad5760405162461bcd60e51b815260206004820152601760248201527f496e76616c6964205469636b657420636f6e74726163740000000000000000006044820152606401610415565b6106be82634cbbe17d60e11b610dc6565b6107025760405162461bcd60e51b8152602060048201526015602482015274125b9d985b1a590810d85cda0818dbdb9d1c9858dd605a1b6044820152606401610415565b609780546001600160a01b038086166001600160a01b0319928316179092556098805492851692909116821790556040805163119f118d60e01b8152905163119f118d916004808201926020929091908290030181600087803b15801561076857600080fd5b505af115801561077c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107a09190611195565b6107ab90600a61115e565b6107bd90670de0b6b3a76400006111ae565b609b55609980546001600160a01b031916331790558015610818576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b505050565b6099546001600160a01b0316336001600160a01b03161461086f5760405162461bcd60e51b815260206004820152600c60248201526b4e6f7420616c6c6f7765642160a01b6044820152606401610415565b6099544790610887906001600160a01b031682610de9565b60995460405182916001600160a01b0316907fe4c6435e17e15f46b7f701bea33335f85ec97aedd5fc0ef37710340e67993df390600090a350565b6108ca610f02565b600081116109245760405162461bcd60e51b815260206004820152602160248201527f4e6577207072696365206d7573742062652067726561746572207468616e20306044820152602160f81b6064820152608401610415565b609b81905560405181907f51c501a650d090855cd4494b7325d48b6fd8b535b039d87c0a1c531cb9ffa22f90600090a250565b61095f610f02565b6109696000610f5c565b565b610973610f02565b806001600160a01b0381166109bd5760405162461bcd60e51b815260206004820152601060248201526f496e76616c696420616464726573732160801b6044820152606401610415565b6001600160a01b0381166000908152609c60209081526040918290208251808401909352805480845260019091015491830191909152610a315760405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964207469636b65742160881b6044820152606401610415565b6001600160a01b0383166000908152609c6020526040902060010154610a995760405162461bcd60e51b815260206004820152601760248201527f5469636b6574206973206f7574206f662074696d6573210000000000000000006044820152606401610415565b6001600160a01b0383166000908152609c602052604081206001908101805491929091610ac79084906111d0565b90915550506001600160a01b0383166000818152609c60209081526040918290206001015491519182527f1f09eebc3d0d1f1f005bdc8f3897cde0550ab3792f446fe984013fcd0d6a0a29910160405180910390a2505050565b8060008111610b635760405162461bcd60e51b815260206004820152600e60248201526d496e76616c69642074696d65732160901b6044820152606401610415565b80609b54610b71919061115e565b3414610bae5760405162461bcd60e51b815260206004820152600c60248201526b496e76616c6964206665652160a01b6044820152606401610415565b336000908152609c602052604090205415610c045760405162461bcd60e51b8152602060048201526016602482015275416c726561647920626f75676874207469636b65742160501b6044820152606401610415565b6097546001600160a01b03166340c10f1933609a60008154610c25906111e7565b91829055506040516001600160e01b031960e085901b1681526001600160a01b0390921660048301526024820152604401600060405180830381600087803b158015610c7057600080fd5b505af1158015610c84573d6000803e3d6000fd5b5050604080518082018252609a805482526020808301888152336000818152609c845286902085518155915160019092019190915591549351888152929550929350917fa9a40dec7a304e5915d11358b968c1e8d365992abf20f82285d1df1b30c8e24c910160405180910390a3505050565b610cff610f02565b6001600160a01b038116610d645760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610415565b610d6d81610f5c565b50565b600054610100900460ff16610d975760405162461bcd60e51b815260040161041590611202565b610969610fae565b600054610100900460ff166109695760405162461bcd60e51b815260040161041590611202565b6000610dd183610fde565b8015610de25750610de28383611011565b9392505050565b80471015610e395760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e63650000006044820152606401610415565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114610e86576040519150601f19603f3d011682016040523d82523d6000602084013e610e8b565b606091505b50509050806108185760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d617920686176652072657665727465640000000000006064820152608401610415565b6033546001600160a01b031633146109695760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610415565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600054610100900460ff16610fd55760405162461bcd60e51b815260040161041590611202565b61096933610f5c565b6000610ff1826301ffc9a760e01b611011565b80156103d1575061100a826001600160e01b0319611011565b1592915050565b604080516001600160e01b03198316602480830191909152825180830390910181526044909101909152602080820180516001600160e01b03166301ffc9a760e01b178152825160009392849283928392918391908a617530fa92503d91506000519050828015611083575060208210155b801561108f5750600081115b979650505050505050565b6000602082840312156110ac57600080fd5b81356001600160e01b031981168114610de257600080fd5b6001600160a01b0381168114610d6d57600080fd5b6000602082840312156110eb57600080fd5b8135610de2816110c4565b60006020828403121561110857600080fd5b5035919050565b6000806040838503121561112257600080fd5b823561112d816110c4565b9150602083013561113d816110c4565b809150509250929050565b634e487b7160e01b600052601160045260246000fd5b600081600019048311821515161561117857611178611148565b500290565b6000821982111561119057611190611148565b500190565b6000602082840312156111a757600080fd5b5051919050565b6000826111cb57634e487b7160e01b600052601260045260246000fd5b500490565b6000828210156111e2576111e2611148565b500390565b60006000198214156111fb576111fb611148565b5060010190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b60608201526080019056fea2646970667358221220d75e4b3f3e3e516210a28973c84c2fc92e62673de9ac8a0f67ae664bc64b7b7164736f6c63430008090033";

type TicketManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TicketManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TicketManager__factory extends ContractFactory {
  constructor(...args: TicketManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TicketManager> {
    return super.deploy(overrides || {}) as Promise<TicketManager>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TicketManager {
    return super.attach(address) as TicketManager;
  }
  override connect(signer: Signer): TicketManager__factory {
    return super.connect(signer) as TicketManager__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TicketManagerInterface {
    return new utils.Interface(_abi) as TicketManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TicketManager {
    return new Contract(address, _abi, signerOrProvider) as TicketManager;
  }
}
