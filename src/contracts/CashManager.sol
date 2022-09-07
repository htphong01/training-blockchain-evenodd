// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import './interfaces/ICash.sol';
import './interfaces/ICashManager.sol';

contract CashManager is ICashManager, ReentrancyGuard, Ownable {
    event Bought(address userAddress, uint256 _amount);
    event Withdrawn(address userAddress, uint256 _amount);

    uint256 public rateConversion = 1; // 1 wei -> 1 cash

    ICash private _cash;

    constructor(address _cashAddress) {
        _cash = ICash(_cashAddress);
    }

    /**
     * Buy some cashes to play game. 1 wei = 1 cash
     */
    function buy() external payable {
        uint256 amount = msg.value / rateConversion;
        _cash.mint(msg.sender, amount);
        emit Bought(msg.sender, amount);
    }

    /**
     * Withdraw amount of cash that user wants
     * @param _amount - Number of cash that user wants to withdraw
     */
    function withdraw(uint256 _amount) external nonReentrant {
        _cash.burn(msg.sender, _amount);
        (bool success, ) = payable(msg.sender).call{value: _amount * rateConversion}('');
        require(success, 'Withdraw not successful!');

        emit Withdrawn(msg.sender, _amount);
    }

    function setRateConversion(uint256 _rate) external onlyOwner {
        rateConversion = _rate;
    }
}