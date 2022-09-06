// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import './interfaces/ICash.sol';
import './interfaces/ICashManager.sol';

contract CashManager is ICashManager, ReentrancyGuard {
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

    function transferFrom(address _from, address _to, uint256 _amount) external returns(bool) {
        bool success = _cash.transferFrom(_from, _to, _amount);
        return success;
    }

    function balanceOf(address _account) external view returns(uint256) {
        return _cash.balanceOf(_account);
    }

    function transfer(address _to, uint256 _amount) external returns(bool) {
        bool success = _cash.transfer(_to, _amount);
        return success;
    }

    function setRateConversion(uint256 _rate) external {
        rateConversion = _rate;
    }
}