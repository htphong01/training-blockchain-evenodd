/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { EvenOdd, EvenOddInterface } from "../../contracts/EvenOdd";

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
        indexed: true,
        internalType: "uint256",
        name: "_gameId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "_isOdd",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "Betted",
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
        name: "_matchId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_isOdd",
        type: "bool",
      },
    ],
    name: "Played",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
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
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "SuppliedToken",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_matchId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "WithDrawn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isOdd",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "bet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cash",
    outputs: [
      {
        internalType: "contract ICash",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
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
    inputs: [
      {
        internalType: "contract ICash",
        name: "_cashAddress",
        type: "address",
      },
      {
        internalType: "contract ICashManager",
        name: "_cashManagerAddress",
        type: "address",
      },
      {
        internalType: "contract ITicketManager",
        name: "_ticketManagerAddress",
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
    name: "lastMatch",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "matchList",
    outputs: [
      {
        internalType: "uint256",
        name: "roll1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "roll2",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isOdd",
        type: "bool",
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
    name: "play",
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
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "playerList",
    outputs: [
      {
        internalType: "uint256",
        name: "ticketId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isOdd",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "bet",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isRewarded",
        type: "bool",
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
    name: "supplyToken",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "ticketManager",
    outputs: [
      {
        internalType: "contract ITicketManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalCashBetted",
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
        internalType: "uint256",
        name: "_matchId",
        type: "uint256",
      },
    ],
    name: "withdraw",
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
  "0x608060405234801561001057600080fd5b506118fd806100206000396000f3fe6080604052600436106100ec5760003560e01c80638976e9841161008a578063c05cdc3f11610059578063c05cdc3f1461035a578063c0c53b8b14610370578063f2fde38b14610390578063f96b61cf146103b057600080fd5b80638976e984146102e35780638da5cb5b1461030757806393e84cd914610325578063961be3911461033a57600080fd5b806336d41c87116100c657806336d41c871461026e57806352059756146102a65780635229a6fd146102ae578063715018a6146102ce57600080fd5b8063140fc4b5146101755780632748cc06146101d65780632e1a7d4d1461024c57600080fd5b366101705734600081116101385760405162461bcd60e51b815260206004820152600e60248201526d496e76616c69642076616c75652160901b60448201526064015b60405180910390fd5b60405134815233907f88a5966d370b9919b20f3e2c13ff65706f196a4e32cc2c12bf57088f885258749060200160405180910390a250005b600080fd5b34801561018157600080fd5b506101b461019036600461163a565b609d6020526000908152604090208054600182015460029092015490919060ff1683565b6040805193845260208401929092521515908201526060015b60405180910390f35b3480156101e257600080fd5b5061022a6101f1366004611653565b609c6020908152600092835260408084209091529082529020805460018201546002830154600390930154919260ff9182169290911684565b60408051948552921515602085015291830152151560608201526080016101cd565b34801561025857600080fd5b5061026c61026736600461163a565b6103d0565b005b34801561027a57600080fd5b5060985461028e906001600160a01b031681565b6040516001600160a01b0390911681526020016101cd565b61026c610783565b3480156102ba57600080fd5b5061026c6102c9366004611683565b6108e9565b3480156102da57600080fd5b5061026c610f60565b3480156102ef57600080fd5b506102f9609a5481565b6040519081526020016101cd565b34801561031357600080fd5b506033546001600160a01b031661028e565b34801561033157600080fd5b5061026c610f74565b34801561034657600080fd5b5060975461028e906001600160a01b031681565b34801561036657600080fd5b506102f9609b5481565b34801561037c57600080fd5b5061026c61038b3660046116c4565b611111565b34801561039c57600080fd5b5061026c6103ab36600461170f565b611379565b3480156103bc57600080fd5b5060995461028e906001600160a01b031681565b600260655414156104235760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015260640161012f565b6002606555609a54811061046a5760405162461bcd60e51b815260206004820152600e60248201526d496e76616c6964206d617463682160901b604482015260640161012f565b60995460408051630412f4ab60e01b815233600482015281516000936001600160a01b031692630412f4ab9260248082019391829003018186803b1580156104b157600080fd5b505afa1580156104c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104e9919061172c565b516000838152609c60209081526040808320848452825291829020825160808101845281548152600182015460ff908116151593820193909352600282015493810193909352600301541615801560608301529192509061058c5760405162461bcd60e51b815260206004820152601d60248201527f486173206265656e2077697468647261776e20746869732067616d6521000000604482015260640161012f565b6000838152609c602090815260408083208584528252808320600301805460ff19166001908117909155868452609d83529281902081516060810183528154815293810154848401526002015460ff161515908301819052908301511515146106375760405162461bcd60e51b815260206004820152601760248201527f446f6573206e6f742077696e20746869732067616d6521000000000000000000604482015260640161012f565b6097546000906001600160a01b031663a9059cbb33604086015161065c90600261179f565b6040516001600160e01b031960e085901b1681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b1580156106a257600080fd5b505af11580156106b6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106da91906117be565b9050806107295760405162461bcd60e51b815260206004820152601760248201527f5769746864726177206e6f74207375636365737366756c000000000000000000604482015260640161012f565b84336001600160a01b03167fcf0a6e5424f1be29da85b3a1a951b7710a56783e142e3f2a2716c579920090c385604001516002610766919061179f565b60405190815260200160405180910390a350506001606555505050565b61078b6113f2565b6000670de0b6b3a7640000609860009054906101000a90046001600160a01b03166001600160a01b031663119f118d6040518163ffffffff1660e01b8152600401602060405180830381600087803b1580156107e657600080fd5b505af11580156107fa573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061081e91906117db565b610828903461179f565b610832919061180a565b9050609860009054906101000a90046001600160a01b03166001600160a01b031663a6f2ae3a346040518263ffffffff1660e01b81526004016000604051808303818588803b15801561088457600080fd5b505af1158015610898573d6000803e3d6000fd5b50505050506108a43390565b6001600160a01b03167f9ca2cae0333a8f82485f67ae1ec6dcee6ada8d9655fd8fcd8d861dc664c02df3826040516108de91815260200190565b60405180910390a250565b6002606554141561093c5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015260640161012f565b600260655580806109805760405162461bcd60e51b815260206004820152600e60248201526d496e76616c69642076616c75652160901b604482015260640161012f565b60995460408051630412f4ab60e01b815233600482015281516000936001600160a01b031692630412f4ab9260248082019391829003018186803b1580156109c757600080fd5b505afa1580156109db573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109ff919061172c565b805190915080610a435760405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964207469636b65742160881b604482015260640161012f565b6020820151610a945760405162461bcd60e51b815260206004820152601760248201527f5469636b6574206973206f7574206f662074696d657321000000000000000000604482015260640161012f565b609a546000908152609c6020908152604080832084845282529182902082516080810184528154808252600183015460ff9081161515948301949094526002830154948201949094526003909101549091161515606082015290821415610b2e5760405162461bcd60e51b815260206004820152600e60248201526d426574746564206265666f72652160901b604482015260640161012f565b60975485906001600160a01b03166370a08231336040516001600160e01b031960e084901b1681526001600160a01b03909116600482015260240160206040518083038186803b158015610b8157600080fd5b505afa158015610b95573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bb991906117db565b1015610bfa5760405162461bcd60e51b815260206004820152601060248201526f457863656564732062616c616e63652160801b604482015260640161012f565b609b54610c07868261181e565b11610c405760405162461bcd60e51b81526020600482015260096024820152684f766572666c6f772160b81b604482015260640161012f565b600085609b54610c50919061181e565b610c5b90600261179f565b6097546040516370a0823160e01b815230600482015291925087916001600160a01b03909116906370a082319060240160206040518083038186803b158015610ca357600080fd5b505afa158015610cb7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cdb91906117db565b610ce5919061181e565b811115610d2c5760405162461bcd60e51b81526020600482015260156024820152744e6f7420656e6f75676820746f207265776172642160581b604482015260640161012f565b6097546001600160a01b03166323b872dd336040516001600160e01b031960e084901b1681526001600160a01b03909116600482015230602482015260448101899052606401602060405180830381600087803b158015610d8c57600080fd5b505af1158015610da0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dc491906117be565b610e105760405162461bcd60e51b815260206004820152601860248201527f5472616e73666572206e6f74207375636365737366756c210000000000000000604482015260640161012f565b85609b6000828254610e22919061181e565b90915550506099546001600160a01b031663d848f991336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401600060405180830381600087803b158015610e7a57600080fd5b505af1158015610e8e573d6000803e3d6000fd5b5050604080516080810182528681528a151560208083018281528385018d8152600060608601818152609a80548352609c86528883208e845290955296902085518155915160018301805491151560ff199283161790559051600283015594516003909101805491151591909516179093559154909350909150610f0f3390565b6001600160a01b03167f83b2d1b40f68a4feab2bdd823b36441a63971c69c6cd0fc02ed4a34c288c7b5b8a604051610f4991815260200190565b60405180910390a450506001606555505050505050565b610f686113f2565b610f72600061144c565b565b610f7c6113f2565b6000610f8960034361180a565b610f9444600261179f565b610f9f600f42611836565b610fa9919061181e565b610fb3919061181e565b90506000600444610fc543600261179f565b6017610fd1464261180a565b610fdc90600561181e565b610fe69190611836565b610ff0919061181e565b610ffa919061181e565b611004919061180a565b9050600060405180606001604052806006856110209190611836565b61102b90600161181e565b815260200161103b600685611836565b61104690600161181e565b81526020016002611057858761181e565b6110619190611836565b6001908114909152609a80546000908152609d60209081526040808320865181559186015194820194909455928401516002909301805460ff191693151593909317909255609b8290558054929350916110ba9061184a565b90915550609a546110cd90600190611865565b7f852d5ad7be25eb05c1a276ae2ac27f8af786329593f3b5b21afcdb19b0ce47878260400151604051611104911515815260200190565b60405180910390a2505050565b600054610100900460ff16158080156111315750600054600160ff909116105b8061114b5750303b15801561114b575060005460ff166001145b6111ae5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840161012f565b6000805460ff1916600117905580156111d1576000805461ff0019166101001790555b6111d961149e565b6111e16114cd565b6111f28463761fbae960e11b6114fc565b6112365760405162461bcd60e51b8152602060048201526015602482015274125b9d985b1a590810d85cda0818dbdb9d1c9858dd605a1b604482015260640161012f565b61124783634cbbe17d60e11b6114fc565b6112935760405162461bcd60e51b815260206004820152601d60248201527f496e76616c69642043617368204d616e6167657220636f6e7472616374000000604482015260640161012f565b6112a4826319c9015360e01b6114fc565b6112f05760405162461bcd60e51b815260206004820152601f60248201527f496e76616c6964205469636b6574204d616e6167657220636f6e747261637400604482015260640161012f565b609780546001600160a01b038087166001600160a01b0319928316179092556098805486841690831617905560998054928516929091169190911790558015611373576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50505050565b6113816113f2565b6001600160a01b0381166113e65760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161012f565b6113ef8161144c565b50565b6033546001600160a01b03163314610f725760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161012f565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600054610100900460ff166114c55760405162461bcd60e51b815260040161012f9061187c565b610f7261151f565b600054610100900460ff166114f45760405162461bcd60e51b815260040161012f9061187c565b610f7261154f565b60006115078361157d565b8015611518575061151883836115b1565b9392505050565b600054610100900460ff166115465760405162461bcd60e51b815260040161012f9061187c565b610f723361144c565b600054610100900460ff166115765760405162461bcd60e51b815260040161012f9061187c565b6001606555565b6000611590826301ffc9a760e01b6115b1565b80156115ab57506115a9826001600160e01b03196115b1565b155b92915050565b604080516001600160e01b03198316602480830191909152825180830390910181526044909101909152602080820180516001600160e01b03166301ffc9a760e01b178152825160009392849283928392918391908a617530fa92503d91506000519050828015611623575060208210155b801561162f5750600081115b979650505050505050565b60006020828403121561164c57600080fd5b5035919050565b6000806040838503121561166657600080fd5b50508035926020909101359150565b80151581146113ef57600080fd5b6000806040838503121561169657600080fd5b82356116a181611675565b946020939093013593505050565b6001600160a01b03811681146113ef57600080fd5b6000806000606084860312156116d957600080fd5b83356116e4816116af565b925060208401356116f4816116af565b91506040840135611704816116af565b809150509250925092565b60006020828403121561172157600080fd5b8135611518816116af565b60006040828403121561173e57600080fd5b6040516040810181811067ffffffffffffffff8211171561176f57634e487b7160e01b600052604160045260246000fd5b604052825181526020928301519281019290925250919050565b634e487b7160e01b600052601160045260246000fd5b60008160001904831182151516156117b9576117b9611789565b500290565b6000602082840312156117d057600080fd5b815161151881611675565b6000602082840312156117ed57600080fd5b5051919050565b634e487b7160e01b600052601260045260246000fd5b600082611819576118196117f4565b500490565b6000821982111561183157611831611789565b500190565b600082611845576118456117f4565b500690565b600060001982141561185e5761185e611789565b5060010190565b60008282101561187757611877611789565b500390565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b60608201526080019056fea26469706673582212206948a55c0405b07a26f11137afc05d5b646674fca7fe67cb540b77bbd8d6cce864736f6c63430008090033";

type EvenOddConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EvenOddConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EvenOdd__factory extends ContractFactory {
  constructor(...args: EvenOddConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<EvenOdd> {
    return super.deploy(overrides || {}) as Promise<EvenOdd>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): EvenOdd {
    return super.attach(address) as EvenOdd;
  }
  override connect(signer: Signer): EvenOdd__factory {
    return super.connect(signer) as EvenOdd__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EvenOddInterface {
    return new utils.Interface(_abi) as EvenOddInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): EvenOdd {
    return new Contract(address, _abi, signerOrProvider) as EvenOdd;
  }
}
