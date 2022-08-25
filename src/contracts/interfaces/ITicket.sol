// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface ITicket is IERC721 {
    function buy() external payable;

    function isExpired(address userAddress) external view returns(bool);

    function subtractTimes(address userAddress) external;

    function getTicketId(address userAddress) external view returns(uint256);

    function getTicketTimes(address userAddress) external view returns(uint256);

    function extendTicket() external payable;

}