import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers, upgrades, run, network } from 'hardhat';
import fs from 'fs';
import {
    Cash__factory,
    CashManager__factory,
    Ticket__factory,
    TicketManager__factory,
    EvenOdd__factory,
    Cash,
    CashManager,
    Ticket,
    TicketManager,
    EvenOdd,
} from '../typechain-types';
import contractAddresses from '../deployed/bsc_1665452075618.json';

async function main() {
    const [deployer]: SignerWithAddress[] = await ethers.getSigners();

    const CashFactory: Cash__factory = await ethers.getContractFactory('Cash');
    const CashManagerFactory: CashManager__factory = await ethers.getContractFactory('CashManager');
    const TicketFactory: Ticket__factory= await ethers.getContractFactory('Ticket');
    const TicketManagerFactory: TicketManager__factory = await ethers.getContractFactory('TicketManager');
    const EvenOddFactory: EvenOdd__factory = await ethers.getContractFactory('EvenOdd');

    const cash: Cash = (await upgrades.upgradeProxy(contractAddresses.cash, CashFactory)) as Cash;
    await cash.deployed();
    const cashImplAddress: string = await upgrades.erc1967.getImplementationAddress(cash.address);

    const cashManager: CashManager = (await upgrades.upgradeProxy(contractAddresses.cashManager, CashManagerFactory)) as CashManager;
    await cashManager.deployed();
    const cashManagerImplAddress: string = await upgrades.erc1967.getImplementationAddress(cashManager.address);

    const ticket: Ticket = (await upgrades.upgradeProxy(contractAddresses.ticket, TicketFactory)) as Ticket;
    await ticket.deployed();
    const ticketImplAddress: string = await upgrades.erc1967.getImplementationAddress(ticket.address);

    const ticketManager: TicketManager = (await upgrades.upgradeProxy(contractAddresses.ticketManager, TicketManagerFactory)) as TicketManager;
    await ticketManager.deployed();
    const ticketManagerImplAddress: string = await upgrades.erc1967.getImplementationAddress(ticketManager.address);

    const evenOdd: EvenOdd = (await upgrades.upgradeProxy(contractAddresses.evenOdd, EvenOddFactory)) as EvenOdd;
    await evenOdd.deployed();
    const evenOddImplAddress: string = await upgrades.erc1967.getImplementationAddress(evenOdd.address);

    // save address of contract to file
    const newContractAddresses: Record<string, any> = {
        ...contractAddresses,
        cashImpl: cashImplAddress,
        ticketImpl: ticketImplAddress,
        cashManagerImpl: cashManagerImplAddress,
        ticketManagerImpl: ticketManagerImplAddress,
        evenOddImpl: evenOddImplAddress,
    }
    await fs.writeFileSync(`src/deployed/${network.name}_${Date.now()}.json`, JSON.stringify(newContractAddresses));

    // verify implementation contracts
    await run('verify:verify', {
        address: cashImplAddress,
    });

    await run('verify:verify', {
        address: cashManagerImplAddress,
    });

    await run('verify:verify', {
        address: ticketImplAddress,
    });

    await run('verify:verify', {
        address: ticketManagerImplAddress,
    });

    await run('verify:verify', {
        address: evenOddImplAddress,
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });