// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;
import '@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol';

interface ICashManager is IERC165Upgradeable {
    function buy() external payable; 

    function withdraw(uint256 amount) external;

    function ethToCash() external returns (uint256);
}