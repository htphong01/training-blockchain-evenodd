async function main() {
    const [deployer, user1, user2, user3] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Cash = await ethers.getContractFactory('Cash');
    const CashManager = await ethers.getContractFactory('CashManager');
    const Ticket = await ethers.getContractFactory('Ticket');
    const TicketManager = await ethers.getContractFactory('TicketManager');
    const EvenOdd = await ethers.getContractFactory('EvenOdd');

    const cash = await Cash.deploy();
    const ticket = await Ticket.deploy();
    const cashManager = await CashManager.deploy(cash.address);
    const ticketManager = await TicketManager.deploy(ticket.address);

    await cash.connect(deployer).setOwner(cashManager.address);
    await ticket.connect(deployer).setOwner(ticketManager.address);

    const evenOdd = await EvenOdd.deploy(cashManager.address, ticketManager.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });