// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import './interfaces/ITicket.sol';

contract Ticket is ERC721Upgradeable, OwnableUpgradeable, ITicket {
    
    function initialize() initializer public {
        __ERC721_init('Ticket', 'Ticket');
        __Ownable_init();
    }


    function mint(address _to, uint256 _tokenId) onlyOwner external {
        _mint(_to, _tokenId);
    }

    function setOwner(address _newOwner) external onlyOwner {
        _transferOwnership(_newOwner);
    }

}
