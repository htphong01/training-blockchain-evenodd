// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import '@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol';

interface ICash is IERC165Upgradeable, IERC20Upgradeable {
    function mint(address userAddress, uint256 amount) external;

    function burn(address userAddress, uint256 amount) external;
}
