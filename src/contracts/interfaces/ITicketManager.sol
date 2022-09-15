// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol';

interface ITicketManager is IERC165Upgradeable {
    function buy() external payable;

    function subtractTimes(address _account) external;

    function extendTicket() external payable;

    function isExpired(address _account) external view returns (bool);

    function getTicketId(address _account) external view returns (uint256);

    function getTicketTimes(address _account) external view returns (uint256);

    function ownerOf(uint256 _ticketId) external view returns (address);
}