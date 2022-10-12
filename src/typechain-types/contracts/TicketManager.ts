/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export type UserTicketStruct = {
  ticketId: PromiseOrValue<BigNumberish>;
  times: PromiseOrValue<BigNumberish>;
};

export type UserTicketStructOutput = [BigNumber, BigNumber] & {
  ticketId: BigNumber;
  times: BigNumber;
};

export interface TicketManagerInterface extends utils.Interface {
  functions: {
    "buy(uint256)": FunctionFragment;
    "cash()": FunctionFragment;
    "extendTicket(uint256)": FunctionFragment;
    "getTicketOf(address)": FunctionFragment;
    "initialize(address,address)": FunctionFragment;
    "lastTicket()": FunctionFragment;
    "owner()": FunctionFragment;
    "pricePerTime()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setPricePerTime(uint256)": FunctionFragment;
    "subtractTimes(address)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "ticket()": FunctionFragment;
    "ticketOf(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "buy"
      | "cash"
      | "extendTicket"
      | "getTicketOf"
      | "initialize"
      | "lastTicket"
      | "owner"
      | "pricePerTime"
      | "renounceOwnership"
      | "setPricePerTime"
      | "subtractTimes"
      | "supportsInterface"
      | "ticket"
      | "ticketOf"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "buy",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "cash", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "extendTicket",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getTicketOf",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "lastTicket",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pricePerTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setPricePerTime",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "subtractTimes",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(functionFragment: "ticket", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ticketOf",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "buy", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "cash", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "extendTicket",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTicketOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lastTicket", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pricePerTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPricePerTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "subtractTimes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ticket", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ticketOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "Bought(address,uint256,uint256)": EventFragment;
    "ExtendedTicket(address,uint256)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "SetPricePerTime(uint256)": EventFragment;
    "SubTractedTimes(address,uint256)": EventFragment;
    "WithDrawn(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Bought"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ExtendedTicket"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetPricePerTime"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SubTractedTimes"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WithDrawn"): EventFragment;
}

export interface BoughtEventObject {
  _account: string;
  _times: BigNumber;
  _ticketId: BigNumber;
}
export type BoughtEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  BoughtEventObject
>;

export type BoughtEventFilter = TypedEventFilter<BoughtEvent>;

export interface ExtendedTicketEventObject {
  _account: string;
  _times: BigNumber;
}
export type ExtendedTicketEvent = TypedEvent<
  [string, BigNumber],
  ExtendedTicketEventObject
>;

export type ExtendedTicketEventFilter = TypedEventFilter<ExtendedTicketEvent>;

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface SetPricePerTimeEventObject {
  _price: BigNumber;
}
export type SetPricePerTimeEvent = TypedEvent<
  [BigNumber],
  SetPricePerTimeEventObject
>;

export type SetPricePerTimeEventFilter = TypedEventFilter<SetPricePerTimeEvent>;

export interface SubTractedTimesEventObject {
  _account: string;
  _remainTimes: BigNumber;
}
export type SubTractedTimesEvent = TypedEvent<
  [string, BigNumber],
  SubTractedTimesEventObject
>;

export type SubTractedTimesEventFilter = TypedEventFilter<SubTractedTimesEvent>;

export interface WithDrawnEventObject {
  _account: string;
  _amount: BigNumber;
}
export type WithDrawnEvent = TypedEvent<
  [string, BigNumber],
  WithDrawnEventObject
>;

export type WithDrawnEventFilter = TypedEventFilter<WithDrawnEvent>;

export interface TicketManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TicketManagerInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    buy(
      _times: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    cash(overrides?: CallOverrides): Promise<[string]>;

    extendTicket(
      _times: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getTicketOf(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[UserTicketStructOutput]>;

    initialize(
      _ticketAddress: PromiseOrValue<string>,
      _cashAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    lastTicket(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pricePerTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setPricePerTime(
      _newPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    subtractTimes(
      _account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    ticket(overrides?: CallOverrides): Promise<[string]>;

    ticketOf(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { ticketId: BigNumber; times: BigNumber }
    >;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  buy(
    _times: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  cash(overrides?: CallOverrides): Promise<string>;

  extendTicket(
    _times: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getTicketOf(
    _account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<UserTicketStructOutput>;

  initialize(
    _ticketAddress: PromiseOrValue<string>,
    _cashAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  lastTicket(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  pricePerTime(overrides?: CallOverrides): Promise<BigNumber>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setPricePerTime(
    _newPrice: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  subtractTimes(
    _account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  ticket(overrides?: CallOverrides): Promise<string>;

  ticketOf(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { ticketId: BigNumber; times: BigNumber }
  >;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    buy(
      _times: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    cash(overrides?: CallOverrides): Promise<string>;

    extendTicket(
      _times: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getTicketOf(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<UserTicketStructOutput>;

    initialize(
      _ticketAddress: PromiseOrValue<string>,
      _cashAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    lastTicket(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    pricePerTime(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setPricePerTime(
      _newPrice: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    subtractTimes(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    ticket(overrides?: CallOverrides): Promise<string>;

    ticketOf(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { ticketId: BigNumber; times: BigNumber }
    >;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Bought(address,uint256,uint256)"(
      _account?: PromiseOrValue<string> | null,
      _times?: null,
      _ticketId?: PromiseOrValue<BigNumberish> | null
    ): BoughtEventFilter;
    Bought(
      _account?: PromiseOrValue<string> | null,
      _times?: null,
      _ticketId?: PromiseOrValue<BigNumberish> | null
    ): BoughtEventFilter;

    "ExtendedTicket(address,uint256)"(
      _account?: PromiseOrValue<string> | null,
      _times?: null
    ): ExtendedTicketEventFilter;
    ExtendedTicket(
      _account?: PromiseOrValue<string> | null,
      _times?: null
    ): ExtendedTicketEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "SetPricePerTime(uint256)"(
      _price?: PromiseOrValue<BigNumberish> | null
    ): SetPricePerTimeEventFilter;
    SetPricePerTime(
      _price?: PromiseOrValue<BigNumberish> | null
    ): SetPricePerTimeEventFilter;

    "SubTractedTimes(address,uint256)"(
      _account?: PromiseOrValue<string> | null,
      _remainTimes?: null
    ): SubTractedTimesEventFilter;
    SubTractedTimes(
      _account?: PromiseOrValue<string> | null,
      _remainTimes?: null
    ): SubTractedTimesEventFilter;

    "WithDrawn(address,uint256)"(
      _account?: PromiseOrValue<string> | null,
      _amount?: PromiseOrValue<BigNumberish> | null
    ): WithDrawnEventFilter;
    WithDrawn(
      _account?: PromiseOrValue<string> | null,
      _amount?: PromiseOrValue<BigNumberish> | null
    ): WithDrawnEventFilter;
  };

  estimateGas: {
    buy(
      _times: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    cash(overrides?: CallOverrides): Promise<BigNumber>;

    extendTicket(
      _times: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getTicketOf(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _ticketAddress: PromiseOrValue<string>,
      _cashAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    lastTicket(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pricePerTime(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setPricePerTime(
      _newPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    subtractTimes(
      _account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    ticket(overrides?: CallOverrides): Promise<BigNumber>;

    ticketOf(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    buy(
      _times: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    cash(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    extendTicket(
      _times: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getTicketOf(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _ticketAddress: PromiseOrValue<string>,
      _cashAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    lastTicket(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pricePerTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setPricePerTime(
      _newPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    subtractTimes(
      _account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ticket(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ticketOf(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
