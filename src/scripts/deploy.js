async function main() {
    const [deployer] = await ethers.getSigners();

    const Cash = await ethers.getContractFactory('Cash');
    const CashManager = await ethers.getContractFactory('CashManager');
    const Ticket = await ethers.getContractFactory('Ticket');
    const TicketManager = await ethers.getContractFactory('TicketManager');
    const EvenOdd = await ethers.getContractFactory('EvenOdd');

    cash = await upgrades.deployProxy(Cash);
    await cash.deployed();

    ticket = await upgrades.deployProxy(Ticket);
    await ticket.deployed();

    cashManager = await upgrades.deployProxy(CashManager, [cash.address]);
    await cashManager.deployed();

    ticketManager = await upgrades.deployProxy(TicketManager, [ticket.address]);
    await ticketManager.deployed();

    await cash.connect(deployer).setOwner(cashManager.address);
    await ticket.connect(deployer).setOwner(ticketManager.address);

    evenOdd = await upgrades.deployProxy(EvenOdd, [cash.address, cashManager.address, ticketManager.address]);
    await evenOdd.deployed();

    console.log('cash', cash.address);
    console.log('ticket', ticket.address);
    console.log('cashManager', cashManager.address);
    console.log('ticketManager', ticketManager.address);
    console.log('evenodd', evenOdd.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
