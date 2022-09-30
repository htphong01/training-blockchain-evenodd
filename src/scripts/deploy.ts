import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers, upgrades, network } from 'hardhat';
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

async function main() {
    const [deployer]: SignerWithAddress[] = await ethers.getSigners();

    const CashFactory: Cash__factory = await ethers.getContractFactory('Cash');
    const CashManagerFactory: CashManager__factory = await ethers.getContractFactory('CashManager');
    const TicketFactory: Ticket__factory= await ethers.getContractFactory('Ticket');
    const TicketManagerFactory: TicketManager__factory = await ethers.getContractFactory('TicketManager');
    const EvenOddFactory: EvenOdd__factory = await ethers.getContractFactory('EvenOdd');

    const cash: Cash = (await upgrades.deployProxy(CashFactory)) as Cash;
    await cash.deployed();
    const cashImplAddress: string = await upgrades.erc1967.getImplementationAddress(cash.address);


    const ticket: Ticket = (await upgrades.deployProxy(TicketFactory)) as Ticket;
    await ticket.deployed();
    const ticketImplAddress: string = await upgrades.erc1967.getImplementationAddress(ticket.address);


    const cashManager: CashManager = (await upgrades.deployProxy(CashManagerFactory, [cash.address])) as CashManager;
    await cashManager.deployed();
    const cashManagerImplAddress: string = await upgrades.erc1967.getImplementationAddress(cashManager.address);

    const ticketManager: TicketManager = (await upgrades.deployProxy(TicketManagerFactory, [ticket.address, cash.address])) as TicketManager;
    await ticketManager.deployed();
    const ticketManagerImplAddress: string = await upgrades.erc1967.getImplementationAddress(ticketManager.address);

    const evenOdd: EvenOdd = (await upgrades.deployProxy(EvenOddFactory, [cash.address, cashManager.address, ticketManager.address])) as EvenOdd;
    await evenOdd.deployed();
    const evenOddImplAddress: string = await upgrades.erc1967.getImplementationAddress(evenOdd.address);

    await cash.connect(deployer).transferOwnership(cashManager.address);
    await ticket.connect(deployer).transferOwnership(ticketManager.address);
    await ticketManager.connect(deployer).transferOwnership(evenOdd.address);

    const contractAddresses: Record<string, any> = {
        cash: cash.address,
        ticket: ticket.address,
        cashManager: cashManager.address,
        ticketManager: ticketManager.address,
        evenOdd: evenOdd.address,
        cashImpl: cashImplAddress,
        ticketImpl: ticketImplAddress,
        cashManagerImpl: cashManagerImplAddress,
        ticketManagerImpl: ticketManagerImplAddress,
        evenOddImpl: evenOddImplAddress,
    }

    await fs.writeFileSync(`src/deployed/${network.name}_${Date.now()}.json`, JSON.stringify(contractAddresses));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
