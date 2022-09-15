// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol';

interface ITicket is IERC165Upgradeable, IERC721Upgradeable {
    function mint(address _to, uint256 _tokenId) external;

    function setOwner(address _newOwner) external;

}