// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface ICashManager {
    function buy() external payable; 

    function withdraw(uint256 amount) external;

    function setRateConversion(uint256 rate) external;
}