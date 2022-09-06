// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface ICashManager {
    function buy() external payable; 

    function withdraw(uint256 amount) external;

    function transferFrom(address from, address to, uint256 amount) external returns(bool);

    function balanceOf(address account) external view returns(uint256);

    function transfer(address to, uint256 amount) external returns(bool);

    function setRateConversion(uint256 rate) external;
}