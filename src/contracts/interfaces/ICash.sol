// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ICash is IERC20 {
    function buy() external payable;

    function withdraw(uint256 amount) external payable;
}
