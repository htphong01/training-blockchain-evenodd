// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import './interfaces/ITicket.sol';

contract Ticket is OwnableUpgradeable, ERC721Upgradeable, ITicket {

    event Minted(address _account, uint256 _tokenId);

    /**
     * @dev Replace for constructor function in order to be upgradeable
     */
    function initialize() public initializer {
        __ERC721_init('Ticket', 'Ticket');
        __Ownable_init();
        __ERC165_init();
    }

    /**
     * @dev Override function `supportsInterface` when using ERC165
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165Upgradeable, ERC721Upgradeable) returns (bool) {
        return interfaceId == type(ITicket).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Used to mint ticket(ERC721) for users
     * @param _to Address of user to mint
     * @param _tokenId Ticket's id of user
     */ 
    function mint(address _to, uint256 _tokenId) external onlyOwner {
        _safeMint(_to, _tokenId);

        emit Minted(_to, _tokenId);
    }
}
