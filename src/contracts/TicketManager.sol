// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165CheckerUpgradeable.sol";
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol';
import './interfaces/ITicket.sol';
import './interfaces/ITicketManager.sol';

contract TicketManager is ERC165Upgradeable, OwnableUpgradeable, ITicketManager {
    event Bought(address indexed _account, uint256 indexed _ticketId);
    event SubTractedTimes(address indexed _account, uint256 _remainTimes);
    event ExtendedTicket(address indexed _account, uint256 _times);

    struct UserTicket {
        uint256 ticketId;
        uint256 times;
    }

    uint256 public latestedTicket;
    uint256 public ticketPrice; // 10 wei -> 1 ticket

    mapping(address => UserTicket) public ticketOf;

    /**
     * @dev Ticket contract interface
     *      Used this contract to mint ERC721
     */
    ITicket public ticket;

    function initialize(ITicket _ticketAddress) initializer public {
        __Ownable_init();
        __ERC165_init();

        require(
            ERC165CheckerUpgradeable.supportsInterface(address(_ticketAddress), type(ITicket).interfaceId), 
            'Invalid Ticket contract'
        );
        ticket = ITicket(_ticketAddress);
        ticketPrice = 10;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165Upgradeable, IERC165Upgradeable) returns (bool) {
        return interfaceId == type(ITicketManager).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Modifier used to check the msg.value
     * @param price The value want to check
     */
    modifier costs(uint256 price) {
        require(msg.value == price, 'User must pay 10 wei to buy a ticket!');
        _;
    }

    /**
     * @dev Buy a ticket to play game. 0.1 eth -> 1 ticket
     * Emit {Bought} events
     */
    function buy() external payable costs(ticketPrice) {
        require(ticketOf[_msgSender()].ticketId == 0, 'This user has already bought ticket!');

        ticket.mint(_msgSender(), ++latestedTicket);

        ticketOf[_msgSender()].ticketId = latestedTicket;
        ticketOf[_msgSender()].times = 3;

        emit Bought(_msgSender(), latestedTicket);
    }

    /**
     * @dev Subtract times of ticket of user
     * @param _account Address of user whom we subtract times ticket of
     * Emit {SubtractedTimes} events
     */
    function subtractTimes(address _account) external {
        require(_account != address(0), 'The address of account is not valid!');
        UserTicket memory userTicket = ticketOf[_account];

        require(userTicket.ticketId != 0, 'This user has not bought ticket!');
        require(userTicket.times > 0, 'This ticket has expired!');

        ticketOf[_account].times -= 1;

        emit SubTractedTimes(_account, ticketOf[_account].times);
    }

    /**
     * @dev Extend ticket when it was expired
     * Emit {ExtendedTicket} events
     */
    function extendTicket() external payable costs(ticketPrice) {
        UserTicket memory userTicket = ticketOf[_msgSender()];

        require(userTicket.ticketId != 0, 'This user has not bought ticket!');
        require(userTicket.times == 0, 'This ticket has not been expired!');

        ticketOf[_msgSender()].times = 3;

        emit ExtendedTicket(_msgSender(), 3);
    }

    /**
     * @dev Check if a ticket is expired!
     * @param _account The address of user's ticket
     * @return isExpired The ticket is expired or not
     */
    function isExpired(address _account) external view returns (bool) {
        require(_account != address(0), 'The address of account is not valid!');
        UserTicket memory userTicket = ticketOf[_account];

        require(userTicket.ticketId != 0, 'This user has not bought ticket!');

        return userTicket.times == 0;
    }

    /**
     * @dev Get ticket Id of a ticket
     * @param _account Address of user's ticketOf
     * @return ticketId The id of the ticket
     */
    function getTicketId(address _account) external view returns (uint256) {
        require(_account != address(0), 'The address of account is not valid!');
        return ticketOf[_account].ticketId;
    }

    /**
     * @dev Get times of a ticket
     * @param _account Address of user's ticket
     * @return ticketTimes The time that this ticket can be used to bet
     */
    function getTicketTimes(address _account) external view returns (uint256) {
        require(_account != address(0), 'The address of account is not valid!');
        UserTicket memory userTicket = ticketOf[_account];

        require(userTicket.ticketId != 0, 'This user has not bought ticket');
        require(userTicket.times > 0, 'This ticket has expired!');

        return userTicket.times;
    }

    /**
     * @dev Get owner of the ticket
     * @param _tokenId The id of ticket
     * @return address The address of owner the ticket
     */
    function ownerOf(uint256 _tokenId) external view returns (address) {
        require(_tokenId > 0, "The id of NFT must be greater than 0");
        return ticket.ownerOf(_tokenId);
    }
}
