require('@nomicfoundation/hardhat-toolbox');
require('@nomicfoundation/hardhat-chai-matchers');
require('@nomicfoundation/hardhat-network-helpers');

require('dotenv').config();
/**
 * verify smart contract
 */
require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            accounts: { count: 10 },
            mining: { auto: true, interval: 1000 },
        },
        ropsten: {
            url: process.env.ROPSTEN_URL,
            accounts: [process.env.DEPLOY_ACCOUNT]
        },
        rinkeby: {
            url: process.env.RINKEBY_URL,
            accounts: [process.env.DEPLOY_ACCOUNT]
        }
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    },
    solidity: {
        version: "0.8.9",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    paths: {
        root: './src',
        sources: './contracts',
        tests: './test',
        cache: './cache',
        artifacts: './artifacts',
    },
    mocha: {
        timeout: 40000
    }
};
