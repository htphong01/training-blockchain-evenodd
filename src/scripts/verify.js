const hre = require("hardhat");
const { cash, ticket, cashManager, ticketManager, evenOdd } = require('../contracts.json');

async function main() {
    await hre.run("verify:verify", {
        address: cash,
        constructorArguments: [],
    });

    await hre.run("verify:verify", {
        address: ticket,
        constructorArguments: [],
    });

    await hre.run("verify:verify", {
        address: cashManager,
        constructorArguments: [cash],
    });

    await hre.run("verify:verify", {
        address: ticketManager,
        constructorArguments: [ticket],
    });

    await hre.run("verify:verify", {
        address: evenOdd,
        constructorArguments: [cash, cashManager, ticketManager],
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });