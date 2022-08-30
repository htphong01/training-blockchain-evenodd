// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import './interfaces/ITicket.sol';

contract Ticket is ERC721, Ownable, ITicket {
    
    constructor() ERC721('Ticket', 'Ticket') {}

    function mint(address _to, uint256 _tokenId) onlyOwner external {
        _mint(_to, _tokenId);
    }

    function setOwner(address _newOwner) external onlyOwner {
        _transferOwnership(_newOwner);
    }

}
