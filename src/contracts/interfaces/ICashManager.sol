// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;
import '@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol';

interface ICashManager is IERC165Upgradeable {
    function buy(uint256 _amount) external payable; 

    function withdraw(uint256 amount) external;

    function setPricePerCash(uint256 rate) external;

    function pricePerCash() external view returns(uint256);
}