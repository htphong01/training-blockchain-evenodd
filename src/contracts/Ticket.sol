// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import './interfaces/ITicket.sol';
import 'hardhat/console.sol';

contract Ticket is ERC721, ITicket {
    uint256 public latestedTicket;

    struct UserTicket {
        uint256 ticketId;
        uint256 times;
    }

    mapping(address => UserTicket) public ticketOf;

    event Bought(address _userAddress);
    event SubTractedTimes(address _userAddress);
    event ExtendedTicket(address _userAddress);

    constructor() ERC721('Ticket', 'Ticket') {}

    modifier costs(uint256 price) {
        require(msg.value == price, 'User must pay 0.1 eth to buy a ticket!');
        _;
    }

    function buy() external payable costs(10**17) {
        require(ticketOf[msg.sender].ticketId == 0, 'This user has already bought ticket!');
        // require(msg.value >= 10**17, 'User must pay 0.1 eth to buy a ticket!');

        _mint(msg.sender, ++latestedTicket);

        ticketOf[msg.sender].ticketId = latestedTicket;
        ticketOf[msg.sender].times = 3;

        emit Bought(msg.sender);
    }

    function subtractTimes(address userAddress) external {
        UserTicket memory userTicket = ticketOf[userAddress];

        require(userTicket.ticketId != 0, 'This user has not bought ticket!');
        require(userTicket.times > 0, 'This ticket has expired!');

        ticketOf[userAddress].times -= 1;
        emit SubTractedTimes(userAddress);
    }

    function extendTicket() external payable costs(10**17) {
        // require(msg.value >= 10**17, 'User must pay 0.1 eth to buy ticket!');
        UserTicket memory userTicket = ticketOf[msg.sender];

        require(userTicket.ticketId != 0, 'This user has not bought ticket!');
        require(userTicket.times == 0, 'This ticket has not been expired!');

        ticketOf[msg.sender].times = 3;

        emit ExtendedTicket(msg.sender);
    }

    function isExpired(address userAddress) external view returns (bool) {
        UserTicket memory userTicket = ticketOf[userAddress];

        require(userTicket.ticketId != 0, 'This user has not bought ticket!');
        
        return userTicket.times == 0;
    }

    function getTicketId(address userAddress) external view returns (uint256) {
        return ticketOf[userAddress].ticketId;
    }

    function getTicketTimes(address userAddress) external view returns (uint256) {
        UserTicket memory userTicket = ticketOf[userAddress];

        require(userTicket.ticketId != 0, 'This user has not bought ticket');
        require(userTicket.times > 0, 'This ticket has expired!');

        return userTicket.times;
    }
}
