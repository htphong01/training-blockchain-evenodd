import hre from 'hardhat';
import { cashImpl, ticketImpl, cashManagerImpl, ticketManagerImpl, evenOddImpl } from '../deployed/ropsten_1664512387315.json';

async function main() {
    await hre.run('verify:verify', {
        address: cashImpl,
    });

    await hre.run('verify:verify', {
        address: ticketImpl,
    });

    await hre.run('verify:verify', {
        address: cashManagerImpl,
    });

    await hre.run('verify:verify', {
        address: ticketManagerImpl,
    });

    await hre.run('verify:verify', {
        address: evenOddImpl,
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
