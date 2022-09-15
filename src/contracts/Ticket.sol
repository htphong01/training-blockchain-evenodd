// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import './interfaces/ITicket.sol';

contract Ticket is ERC165Upgradeable, ERC721Upgradeable, OwnableUpgradeable, ITicket {
    function initialize() public initializer {
        __ERC721_init('Ticket', 'Ticket');
        __Ownable_init();
        __ERC165_init();
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165Upgradeable, IERC165Upgradeable, ERC721Upgradeable) returns (bool) {
        return interfaceId == type(ITicket).interfaceId || super.supportsInterface(interfaceId);
    }

    function mint(address _to, uint256 _tokenId) external onlyOwner {
        _mint(_to, _tokenId);
    }

    function setOwner(address _newOwner) external onlyOwner {
        _transferOwnership(_newOwner);
    }
}
