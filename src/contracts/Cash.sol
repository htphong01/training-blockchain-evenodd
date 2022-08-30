// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import './interfaces/ICash.sol';

contract Cash is ERC20, Ownable, ICash {

    constructor() ERC20('Cash', 'C') {}

    function mint(address _account, uint256 _amount) onlyOwner external {
        _mint(_account, _amount);
    }

    function burn(address _account, uint256 _amount) onlyOwner external {
        _burn(_account, _amount);
    }

    function setOwner(address _newOwner) external onlyOwner {
        _transferOwnership(_newOwner);
    }
}
