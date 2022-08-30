require('@nomicfoundation/hardhat-toolbox');
require('@nomicfoundation/hardhat-chai-matchers');
require('@nomicfoundation/hardhat-network-helpers');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: '0.8.9',
    paths: {
        root: './src',
        sources: './contracts',
        tests: './test',
        cache: './cache',
        artifacts: './artifacts',
    },
};
