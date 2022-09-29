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
    PopulatedTransaction,
    Signer,
    utils,
} from 'ethers';
import type { FunctionFragment, Result, EventFragment } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from '../common';

export interface CashInterface extends utils.Interface {
    functions: {
        'allowance(address,address)': FunctionFragment;
        'approve(address,uint256)': FunctionFragment;
        'balanceOf(address)': FunctionFragment;
        'burn(address,uint256)': FunctionFragment;
        'decimals()': FunctionFragment;
        'decreaseAllowance(address,uint256)': FunctionFragment;
        'getDecimals()': FunctionFragment;
        'increaseAllowance(address,uint256)': FunctionFragment;
        'initialize()': FunctionFragment;
        'mint(address,uint256)': FunctionFragment;
        'name()': FunctionFragment;
        'owner()': FunctionFragment;
        'renounceOwnership()': FunctionFragment;
        'supportsInterface(bytes4)': FunctionFragment;
        'symbol()': FunctionFragment;
        'totalSupply()': FunctionFragment;
        'transfer(address,uint256)': FunctionFragment;
        'transferFrom(address,address,uint256)': FunctionFragment;
        'transferOwnership(address)': FunctionFragment;
    };

    getFunction(
        nameOrSignatureOrTopic:
            | 'allowance'
            | 'approve'
            | 'balanceOf'
            | 'burn'
            | 'decimals'
            | 'decreaseAllowance'
            | 'getDecimals'
            | 'increaseAllowance'
            | 'initialize'
            | 'mint'
            | 'name'
            | 'owner'
            | 'renounceOwnership'
            | 'supportsInterface'
            | 'symbol'
            | 'totalSupply'
            | 'transfer'
            | 'transferFrom'
            | 'transferOwnership'
    ): FunctionFragment;

    encodeFunctionData(functionFragment: 'allowance', values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(
        functionFragment: 'approve',
        values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
    ): string;
    encodeFunctionData(functionFragment: 'balanceOf', values: [PromiseOrValue<string>]): string;
    encodeFunctionData(
        functionFragment: 'burn',
        values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
    ): string;
    encodeFunctionData(functionFragment: 'decimals', values?: undefined): string;
    encodeFunctionData(
        functionFragment: 'decreaseAllowance',
        values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
    ): string;
    encodeFunctionData(functionFragment: 'getDecimals', values?: undefined): string;
    encodeFunctionData(
        functionFragment: 'increaseAllowance',
        values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
    ): string;
    encodeFunctionData(functionFragment: 'initialize', values?: undefined): string;
    encodeFunctionData(
        functionFragment: 'mint',
        values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
    ): string;
    encodeFunctionData(functionFragment: 'name', values?: undefined): string;
    encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
    encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
    encodeFunctionData(functionFragment: 'supportsInterface', values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'symbol', values?: undefined): string;
    encodeFunctionData(functionFragment: 'totalSupply', values?: undefined): string;
    encodeFunctionData(
        functionFragment: 'transfer',
        values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
    ): string;
    encodeFunctionData(
        functionFragment: 'transferFrom',
        values: [PromiseOrValue<string>, PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
    ): string;
    encodeFunctionData(functionFragment: 'transferOwnership', values: [PromiseOrValue<string>]): string;

    decodeFunctionResult(functionFragment: 'allowance', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'approve', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'burn', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'decimals', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'decreaseAllowance', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'getDecimals', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'increaseAllowance', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'initialize', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'mint', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'name', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'supportsInterface', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'symbol', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'totalSupply', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'transfer', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'transferFrom', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;

    events: {
        'Approval(address,address,uint256)': EventFragment;
        'Burned(address,uint256)': EventFragment;
        'Initialized(uint8)': EventFragment;
        'Minted(address,uint256)': EventFragment;
        'OwnershipTransferred(address,address)': EventFragment;
        'Transfer(address,address,uint256)': EventFragment;
    };

    getEvent(nameOrSignatureOrTopic: 'Approval'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'Burned'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'Initialized'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'Minted'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'Transfer'): EventFragment;
}

export interface ApprovalEventObject {
    owner: string;
    spender: string;
    value: BigNumber;
}
export type ApprovalEvent = TypedEvent<[string, string, BigNumber], ApprovalEventObject>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export interface BurnedEventObject {
    _account: string;
    _amount: BigNumber;
}
export type BurnedEvent = TypedEvent<[string, BigNumber], BurnedEventObject>;

export type BurnedEventFilter = TypedEventFilter<BurnedEvent>;

export interface InitializedEventObject {
    version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface MintedEventObject {
    _account: string;
    _amount: BigNumber;
}
export type MintedEvent = TypedEvent<[string, BigNumber], MintedEventObject>;

export type MintedEventFilter = TypedEventFilter<MintedEvent>;

export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[string, string], OwnershipTransferredEventObject>;

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;

export interface TransferEventObject {
    from: string;
    to: string;
    value: BigNumber;
}
export type TransferEvent = TypedEvent<[string, string, BigNumber], TransferEventObject>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export interface Cash extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;

    interface: CashInterface;

    queryFilter<TEvent extends TypedEvent>(
        event: TypedEventFilter<TEvent>,
        fromBlockOrBlockhash?: string | number | undefined,
        toBlock?: string | number | undefined
    ): Promise<Array<TEvent>>;

    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;

    functions: {
        allowance(
            owner: PromiseOrValue<string>,
            spender: PromiseOrValue<string>,
            overrides?: CallOverrides
        ): Promise<[BigNumber]>;

        approve(
            spender: PromiseOrValue<string>,
            amount: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<ContractTransaction>;

        balanceOf(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

        burn(
            _account: PromiseOrValue<string>,
            _amount: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<ContractTransaction>;

        decimals(overrides?: CallOverrides): Promise<[number]>;

        decreaseAllowance(
            spender: PromiseOrValue<string>,
            subtractedValue: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<ContractTransaction>;

        getDecimals(overrides?: CallOverrides): Promise<[number]>;

        increaseAllowance(
            spender: PromiseOrValue<string>,
            addedValue: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<ContractTransaction>;

        initialize(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

        mint(
            _account: PromiseOrValue<string>,
            _amount: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<ContractTransaction>;

        name(overrides?: CallOverrides): Promise<[string]>;

        owner(overrides?: CallOverrides): Promise<[string]>;

        renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;

        symbol(overrides?: CallOverrides): Promise<[string]>;

        totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

        transfer(
            to: PromiseOrValue<string>,
            amount: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<ContractTransaction>;

        transferFrom(
            from: PromiseOrValue<string>,
            to: PromiseOrValue<string>,
            amount: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<ContractTransaction>;

        transferOwnership(
            newOwner: PromiseOrValue<string>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<ContractTransaction>;
    };

    allowance(
        owner: PromiseOrValue<string>,
        spender: PromiseOrValue<string>,
        overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
        spender: PromiseOrValue<string>,
        amount: PromiseOrValue<BigNumberish>,
        overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    balanceOf(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    burn(
        _account: PromiseOrValue<string>,
        _amount: PromiseOrValue<BigNumberish>,
        overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    decimals(overrides?: CallOverrides): Promise<number>;

    decreaseAllowance(
        spender: PromiseOrValue<string>,
        subtractedValue: PromiseOrValue<BigNumberish>,
        overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getDecimals(overrides?: CallOverrides): Promise<number>;

    increaseAllowance(
        spender: PromiseOrValue<string>,
        addedValue: PromiseOrValue<BigNumberish>,
        overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    initialize(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    mint(
        _account: PromiseOrValue<string>,
        _amount: PromiseOrValue<BigNumberish>,
        overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    name(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;

    symbol(overrides?: CallOverrides): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
        to: PromiseOrValue<string>,
        amount: PromiseOrValue<BigNumberish>,
        overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferFrom(
        from: PromiseOrValue<string>,
        to: PromiseOrValue<string>,
        amount: PromiseOrValue<BigNumberish>,
        overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
        newOwner: PromiseOrValue<string>,
        overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    callStatic: {
        allowance(
            owner: PromiseOrValue<string>,
            spender: PromiseOrValue<string>,
            overrides?: CallOverrides
        ): Promise<BigNumber>;

        approve(
            spender: PromiseOrValue<string>,
            amount: PromiseOrValue<BigNumberish>,
            overrides?: CallOverrides
        ): Promise<boolean>;

        balanceOf(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

        burn(
            _account: PromiseOrValue<string>,
            _amount: PromiseOrValue<BigNumberish>,
            overrides?: CallOverrides
        ): Promise<void>;

        decimals(overrides?: CallOverrides): Promise<number>;

        decreaseAllowance(
            spender: PromiseOrValue<string>,
            subtractedValue: PromiseOrValue<BigNumberish>,
            overrides?: CallOverrides
        ): Promise<boolean>;

        getDecimals(overrides?: CallOverrides): Promise<number>;

        increaseAllowance(
            spender: PromiseOrValue<string>,
            addedValue: PromiseOrValue<BigNumberish>,
            overrides?: CallOverrides
        ): Promise<boolean>;

        initialize(overrides?: CallOverrides): Promise<void>;

        mint(
            _account: PromiseOrValue<string>,
            _amount: PromiseOrValue<BigNumberish>,
            overrides?: CallOverrides
        ): Promise<void>;

        name(overrides?: CallOverrides): Promise<string>;

        owner(overrides?: CallOverrides): Promise<string>;

        renounceOwnership(overrides?: CallOverrides): Promise<void>;

        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;

        symbol(overrides?: CallOverrides): Promise<string>;

        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

        transfer(
            to: PromiseOrValue<string>,
            amount: PromiseOrValue<BigNumberish>,
            overrides?: CallOverrides
        ): Promise<boolean>;

        transferFrom(
            from: PromiseOrValue<string>,
            to: PromiseOrValue<string>,
            amount: PromiseOrValue<BigNumberish>,
            overrides?: CallOverrides
        ): Promise<boolean>;

        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };

    filters: {
        'Approval(address,address,uint256)'(
            owner?: PromiseOrValue<string> | null,
            spender?: PromiseOrValue<string> | null,
            value?: null
        ): ApprovalEventFilter;
        Approval(
            owner?: PromiseOrValue<string> | null,
            spender?: PromiseOrValue<string> | null,
            value?: null
        ): ApprovalEventFilter;

        'Burned(address,uint256)'(_account?: PromiseOrValue<string> | null, _amount?: null): BurnedEventFilter;
        Burned(_account?: PromiseOrValue<string> | null, _amount?: null): BurnedEventFilter;

        'Initialized(uint8)'(version?: null): InitializedEventFilter;
        Initialized(version?: null): InitializedEventFilter;

        'Minted(address,uint256)'(_account?: PromiseOrValue<string> | null, _amount?: null): MintedEventFilter;
        Minted(_account?: PromiseOrValue<string> | null, _amount?: null): MintedEventFilter;

        'OwnershipTransferred(address,address)'(
            previousOwner?: PromiseOrValue<string> | null,
            newOwner?: PromiseOrValue<string> | null
        ): OwnershipTransferredEventFilter;
        OwnershipTransferred(
            previousOwner?: PromiseOrValue<string> | null,
            newOwner?: PromiseOrValue<string> | null
        ): OwnershipTransferredEventFilter;

        'Transfer(address,address,uint256)'(
            from?: PromiseOrValue<string> | null,
            to?: PromiseOrValue<string> | null,
            value?: null
        ): TransferEventFilter;
        Transfer(
            from?: PromiseOrValue<string> | null,
            to?: PromiseOrValue<string> | null,
            value?: null
        ): TransferEventFilter;
    };

    estimateGas: {
        allowance(
            owner: PromiseOrValue<string>,
            spender: PromiseOrValue<string>,
            overrides?: CallOverrides
        ): Promise<BigNumber>;

        approve(
            spender: PromiseOrValue<string>,
            amount: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<BigNumber>;

        balanceOf(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

        burn(
            _account: PromiseOrValue<string>,
            _amount: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<BigNumber>;

        decimals(overrides?: CallOverrides): Promise<BigNumber>;

        decreaseAllowance(
            spender: PromiseOrValue<string>,
            subtractedValue: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<BigNumber>;

        getDecimals(overrides?: CallOverrides): Promise<BigNumber>;

        increaseAllowance(
            spender: PromiseOrValue<string>,
            addedValue: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<BigNumber>;

        initialize(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

        mint(
            _account: PromiseOrValue<string>,
            _amount: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<BigNumber>;

        name(overrides?: CallOverrides): Promise<BigNumber>;

        owner(overrides?: CallOverrides): Promise<BigNumber>;

        renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;

        symbol(overrides?: CallOverrides): Promise<BigNumber>;

        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

        transfer(
            to: PromiseOrValue<string>,
            amount: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<BigNumber>;

        transferFrom(
            from: PromiseOrValue<string>,
            to: PromiseOrValue<string>,
            amount: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<BigNumber>;

        transferOwnership(
            newOwner: PromiseOrValue<string>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<BigNumber>;
    };

    populateTransaction: {
        allowance(
            owner: PromiseOrValue<string>,
            spender: PromiseOrValue<string>,
            overrides?: CallOverrides
        ): Promise<PopulatedTransaction>;

        approve(
            spender: PromiseOrValue<string>,
            amount: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<PopulatedTransaction>;

        balanceOf(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

        burn(
            _account: PromiseOrValue<string>,
            _amount: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<PopulatedTransaction>;

        decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        decreaseAllowance(
            spender: PromiseOrValue<string>,
            subtractedValue: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<PopulatedTransaction>;

        getDecimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        increaseAllowance(
            spender: PromiseOrValue<string>,
            addedValue: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<PopulatedTransaction>;

        initialize(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

        mint(
            _account: PromiseOrValue<string>,
            _amount: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<PopulatedTransaction>;

        name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

        supportsInterface(
            interfaceId: PromiseOrValue<BytesLike>,
            overrides?: CallOverrides
        ): Promise<PopulatedTransaction>;

        symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        transfer(
            to: PromiseOrValue<string>,
            amount: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<PopulatedTransaction>;

        transferFrom(
            from: PromiseOrValue<string>,
            to: PromiseOrValue<string>,
            amount: PromiseOrValue<BigNumberish>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<PopulatedTransaction>;

        transferOwnership(
            newOwner: PromiseOrValue<string>,
            overrides?: Overrides & { from?: PromiseOrValue<string> }
        ): Promise<PopulatedTransaction>;
    };
}
