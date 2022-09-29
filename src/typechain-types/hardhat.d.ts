/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from 'ethers';
import { FactoryOptions, HardhatEthersHelpers as HardhatEthersHelpersBase } from '@nomiclabs/hardhat-ethers/types';

import * as Contracts from '.';

declare module 'hardhat/types/runtime' {
    interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
        getContractFactory(
            name: 'OwnableUpgradeable',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.OwnableUpgradeable__factory>;
        getContractFactory(
            name: 'Initializable',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.Initializable__factory>;
        getContractFactory(
            name: 'PullPaymentUpgradeable',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.PullPaymentUpgradeable__factory>;
        getContractFactory(
            name: 'ReentrancyGuardUpgradeable',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.ReentrancyGuardUpgradeable__factory>;
        getContractFactory(
            name: 'ERC20Upgradeable',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.ERC20Upgradeable__factory>;
        getContractFactory(
            name: 'IERC20MetadataUpgradeable',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.IERC20MetadataUpgradeable__factory>;
        getContractFactory(
            name: 'IERC20Upgradeable',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.IERC20Upgradeable__factory>;
        getContractFactory(
            name: 'ERC721Upgradeable',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.ERC721Upgradeable__factory>;
        getContractFactory(
            name: 'IERC721MetadataUpgradeable',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.IERC721MetadataUpgradeable__factory>;
        getContractFactory(
            name: 'IERC721ReceiverUpgradeable',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.IERC721ReceiverUpgradeable__factory>;
        getContractFactory(
            name: 'IERC721Upgradeable',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.IERC721Upgradeable__factory>;
        getContractFactory(
            name: 'ContextUpgradeable',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.ContextUpgradeable__factory>;
        getContractFactory(
            name: 'EscrowUpgradeable',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.EscrowUpgradeable__factory>;
        getContractFactory(
            name: 'ERC165Upgradeable',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.ERC165Upgradeable__factory>;
        getContractFactory(
            name: 'IERC165Upgradeable',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.IERC165Upgradeable__factory>;
        getContractFactory(
            name: 'Cash',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.Cash__factory>;
        getContractFactory(
            name: 'CashManager',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.CashManager__factory>;
        getContractFactory(
            name: 'EvenOdd',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.EvenOdd__factory>;
        getContractFactory(
            name: 'ICash',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.ICash__factory>;
        getContractFactory(
            name: 'ICashManager',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.ICashManager__factory>;
        getContractFactory(
            name: 'ITicket',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.ITicket__factory>;
        getContractFactory(
            name: 'ITicketManager',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.ITicketManager__factory>;
        getContractFactory(
            name: 'Ticket',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.Ticket__factory>;
        getContractFactory(
            name: 'TicketManager',
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<Contracts.TicketManager__factory>;

        getContractAt(
            name: 'OwnableUpgradeable',
            address: string,
            signer?: ethers.Signer
        ): Promise<Contracts.OwnableUpgradeable>;
        getContractAt(name: 'Initializable', address: string, signer?: ethers.Signer): Promise<Contracts.Initializable>;
        getContractAt(
            name: 'PullPaymentUpgradeable',
            address: string,
            signer?: ethers.Signer
        ): Promise<Contracts.PullPaymentUpgradeable>;
        getContractAt(
            name: 'ReentrancyGuardUpgradeable',
            address: string,
            signer?: ethers.Signer
        ): Promise<Contracts.ReentrancyGuardUpgradeable>;
        getContractAt(
            name: 'ERC20Upgradeable',
            address: string,
            signer?: ethers.Signer
        ): Promise<Contracts.ERC20Upgradeable>;
        getContractAt(
            name: 'IERC20MetadataUpgradeable',
            address: string,
            signer?: ethers.Signer
        ): Promise<Contracts.IERC20MetadataUpgradeable>;
        getContractAt(
            name: 'IERC20Upgradeable',
            address: string,
            signer?: ethers.Signer
        ): Promise<Contracts.IERC20Upgradeable>;
        getContractAt(
            name: 'ERC721Upgradeable',
            address: string,
            signer?: ethers.Signer
        ): Promise<Contracts.ERC721Upgradeable>;
        getContractAt(
            name: 'IERC721MetadataUpgradeable',
            address: string,
            signer?: ethers.Signer
        ): Promise<Contracts.IERC721MetadataUpgradeable>;
        getContractAt(
            name: 'IERC721ReceiverUpgradeable',
            address: string,
            signer?: ethers.Signer
        ): Promise<Contracts.IERC721ReceiverUpgradeable>;
        getContractAt(
            name: 'IERC721Upgradeable',
            address: string,
            signer?: ethers.Signer
        ): Promise<Contracts.IERC721Upgradeable>;
        getContractAt(
            name: 'ContextUpgradeable',
            address: string,
            signer?: ethers.Signer
        ): Promise<Contracts.ContextUpgradeable>;
        getContractAt(
            name: 'EscrowUpgradeable',
            address: string,
            signer?: ethers.Signer
        ): Promise<Contracts.EscrowUpgradeable>;
        getContractAt(
            name: 'ERC165Upgradeable',
            address: string,
            signer?: ethers.Signer
        ): Promise<Contracts.ERC165Upgradeable>;
        getContractAt(
            name: 'IERC165Upgradeable',
            address: string,
            signer?: ethers.Signer
        ): Promise<Contracts.IERC165Upgradeable>;
        getContractAt(name: 'Cash', address: string, signer?: ethers.Signer): Promise<Contracts.Cash>;
        getContractAt(name: 'CashManager', address: string, signer?: ethers.Signer): Promise<Contracts.CashManager>;
        getContractAt(name: 'EvenOdd', address: string, signer?: ethers.Signer): Promise<Contracts.EvenOdd>;
        getContractAt(name: 'ICash', address: string, signer?: ethers.Signer): Promise<Contracts.ICash>;
        getContractAt(name: 'ICashManager', address: string, signer?: ethers.Signer): Promise<Contracts.ICashManager>;
        getContractAt(name: 'ITicket', address: string, signer?: ethers.Signer): Promise<Contracts.ITicket>;
        getContractAt(
            name: 'ITicketManager',
            address: string,
            signer?: ethers.Signer
        ): Promise<Contracts.ITicketManager>;
        getContractAt(name: 'Ticket', address: string, signer?: ethers.Signer): Promise<Contracts.Ticket>;
        getContractAt(name: 'TicketManager', address: string, signer?: ethers.Signer): Promise<Contracts.TicketManager>;

        // default types
        getContractFactory(
            name: string,
            signerOrOptions?: ethers.Signer | FactoryOptions
        ): Promise<ethers.ContractFactory>;
        getContractFactory(
            abi: any[],
            bytecode: ethers.utils.BytesLike,
            signer?: ethers.Signer
        ): Promise<ethers.ContractFactory>;
        getContractAt(nameOrAbi: string | any[], address: string, signer?: ethers.Signer): Promise<ethers.Contract>;
    }
}
