// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import './interfaces/ITicket.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketManager is Ownable {

    event Bought(address _account, uint256 ticketId);
    event SubTractedTimes(address _account, uint256 remainTimes);
    event ExtendedTicket(address _account, uint256 times);

    uint256 public latestedTicket;
    uint256 public ticketPrice = 10; // 10 wei -> 1 ticket

    struct UserTicket {
        uint256 ticketId;
        uint256 times;
    }

    mapping(address => UserTicket) public ticketOf;

    ITicket private _ticket;

    constructor(address ticketAddress) {
        _ticket = ITicket(ticketAddress);
    }

    modifier costs(uint256 price) {
        require(msg.value == price, 'User must pay 10 wei to buy a ticket!');
        _;
    }

    /**
     * Buy a ticket to play game. 0.1 eth -> 1 ticket
     */
    function buy() external payable costs(ticketPrice) {
        require(ticketOf[_msgSender()].ticketId == 0, 'This user has already bought ticket!');

        _ticket.mint(_msgSender(), ++latestedTicket);

        ticketOf[_msgSender()].ticketId = latestedTicket;
        ticketOf[_msgSender()].times = 3;

        emit Bought(_msgSender(), latestedTicket);
    }

    /**
     * Subtract times of ticket of user
     * @param _account - Address of user whom we subtract times ticket of
     */
    function subtractTimes(address _account) external {
        UserTicket memory userTicket = ticketOf[_account];

        require(userTicket.ticketId != 0, 'This user has not bought ticket!');
        require(userTicket.times > 0, 'This ticket has expired!');

        ticketOf[_account].times -= 1;

        emit SubTractedTimes(_account, ticketOf[_account].times);
    }

    /**
     * Extend ticket when it was expired
     */
    function extendTicket() external payable costs(ticketPrice) {
        UserTicket memory userTicket = ticketOf[_msgSender()];

        require(userTicket.ticketId != 0, 'This user has not bought ticket!');
        require(userTicket.times == 0, 'This ticket has not been expired!');

        ticketOf[_msgSender()].times = 3;

        emit ExtendedTicket(_msgSender(), 3);
    }

    /**
     * Check if a ticket is expired!
     * @param _account - The address of user's ticket
     * @return isExpired -  the ticket is expired or not 
     */
    function isExpired(address _account) external view returns (bool) {
        UserTicket memory userTicket = ticketOf[_account];

        require(userTicket.ticketId != 0, 'This user has not bought ticket!');
        
        return userTicket.times == 0;
    }

    /**
     * Get ticket Id of a ticket
     * @param _account - Address of user's ticketOf
     * @return ticketId The id of the ticket
     */
    function getTicketId(address _account) external view returns (uint256) {
        return ticketOf[_account].ticketId;
    }

    /**
     * Get times of a ticket
     * @param _account - Address of user's ticket
     * @return ticketTimes - The time that this ticket can be used to bet
     */
    function getTicketTimes(address _account) external view returns (uint256) {
        UserTicket memory userTicket = ticketOf[_account];

        require(userTicket.ticketId != 0, 'This user has not bought ticket');
        require(userTicket.times > 0, 'This ticket has expired!');

        return userTicket.times;
    }

    /**
     * Get owner of the ticket
     * @param _tokenId - The id of ticket
     * @return address - The address of owner the ticket
     */
    function ownerOf(uint256 _tokenId) external view returns (address) { 
        return _ticket.ownerOf(_tokenId);
    }
}