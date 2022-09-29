// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import '@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol';

/**
 * @dev struct for storing information about user ticket
 */
struct UserTicket {
        uint256 ticketId;
        uint256 times;
}

interface ITicketManager is IERC165Upgradeable {
    function buy(uint256 _times) external payable;

    function subtractTimes(address _account) external;

    function extendTicket(uint256 _times) external payable;

    function getTicketOf(address _account) external view returns (UserTicket memory);
}