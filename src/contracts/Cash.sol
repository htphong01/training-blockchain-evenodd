// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import './interfaces/ICash.sol';
import 'hardhat/console.sol';

contract Cash is ERC20, ICash, ReentrancyGuard {
    
    event Bought(uint256 _amount);
    event Withdrawn(uint256 _amount);

    constructor() ERC20('Cash', 'C') {}

    function buy() external payable {
        _mint(msg.sender, msg.value / 10**17); // 1 eth -> 10 cash

        emit Bought(msg.value / 10**17);
    }

    function withdraw(uint256 amount) external payable nonReentrant {
        require(balanceOf(msg.sender) >= amount, 'Current balance is not enough');

        (bool success, ) = payable(msg.sender).call{value: amount * 10**17}('');
        require(success, 'Withdraw not successful!');
        // payable(msg.sender).transfer(amount * (10**17));
       _burn(msg.sender, amount);
        emit Withdrawn(amount);
    }
}
