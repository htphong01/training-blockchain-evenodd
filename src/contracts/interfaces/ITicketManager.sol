// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import '@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol';

interface ITicketManager is IERC165Upgradeable {
    function buy(uint256 _times) external payable;

    function subtractTimes(address _account) external;

    function extendTicket(uint256 _times) external payable;

    function isOutOfTimes(address _account) external view returns (bool);

    function getTicketId(address _account) external view returns (uint256);
}