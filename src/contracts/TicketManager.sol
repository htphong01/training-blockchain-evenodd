// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165CheckerUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol';
import './interfaces/ITicket.sol';
import './interfaces/ICash.sol';
import './interfaces/ITicketManager.sol';

contract TicketManager is OwnableUpgradeable, ERC165Upgradeable, ITicketManager {
    /**
     * @dev Ticket contract interface
     *      Used this contract to mint ERC721
     */
    ITicket public ticket;

    /**
     * @dev Cash contract interface
     *      Using this contract to mint and burn ERC20 token
     */
    ICash public cash;

    uint256 public lastTicket;
    uint256 public pricePerTime; // default: 10 ** decimals() / 2

    /**
     * @dev Save list user's tickets
     */
    mapping(address => UserTicket) public ticketOf;

    event Bought(address indexed _account, uint256 _times, uint256 indexed _ticketId);
    event SubTractedTimes(address indexed _account, uint256 _remainTimes);
    event ExtendedTicket(address indexed _account, uint256 _times);
    event SetPricePerTime(uint256 indexed _price);
    event WithDrawn(address indexed _account, uint256 indexed _amount);

    /**
     * @dev Modifier used to check the msg.value
     * @param _times The times want to buy or extend
     */
    modifier validTimesAndCosts(uint256 _times) {
        require(_times > 0, 'Invalid times!');
        require(msg.value == pricePerTime * _times, 'Invalid fee!');
        _;
    }

    /**
     * @dev Modifier used to check the user has bought the ticket
     * @param _account The address want to check
     */
    modifier validTicket(address _account) {
        require(_account != address(0), 'Invalid address!');
        UserTicket memory userTicket = ticketOf[_account];
        require(userTicket.ticketId != 0, 'Invalid ticket!');
        _;
    }

    /**
     * @dev Replace for constructor function in order to be upgradeable
     * @param _ticketAddress Address of contract Ticket
     */
    function initialize(ITicket _ticketAddress, ICash _cashAddress) public initializer {
        __Ownable_init();
        __ERC165_init();

        require(
            ERC165CheckerUpgradeable.supportsInterface(address(_ticketAddress), type(ITicket).interfaceId),
            'Invalid Ticket contract'
        );

        require(
            ERC165CheckerUpgradeable.supportsInterface(address(_cashAddress), type(ICash).interfaceId),
            'Invalid Cash contract'
        );

        ticket = _ticketAddress;
        cash = _cashAddress;
        pricePerTime = 10 ** cash.decimals();
    }

    /**
     * @dev Override function `supportsInterface` when using ERC165
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC165Upgradeable, IERC165Upgradeable)
        returns (bool)
    {
        return interfaceId == type(ITicketManager).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Buy a ticket to play game. 0.1 eth -> 1 ticket
     * Emit {Bought} events
     */
    function buy(uint256 _times) external payable validTimesAndCosts(_times) {
        require(ticketOf[_msgSender()].ticketId == 0, 'Already bought ticket!');

        ticket.mint(_msgSender(), ++lastTicket);

        UserTicket memory newUserTicket = UserTicket(lastTicket, _times);
        ticketOf[_msgSender()] = newUserTicket;
        AddressUpgradeable.sendValue(payable(owner()), msg.value);

        emit Bought(_msgSender(), _times, lastTicket);  
    }

    /**
     * @dev Subtract times of ticket of user
     * @param _account Address of user whom we subtract times ticket of
     * Emit {SubtractedTimes} events
     */
    function subtractTimes(address _account) external onlyOwner validTicket(_account) {
        require(ticketOf[_account].times > 0, 'Ticket is out of times!');

        ticketOf[_account].times -= 1;

        emit SubTractedTimes(_account, ticketOf[_account].times);
    }

    /**
     * @dev Extend ticket when it was expired
     * @param _times The time that user want to extend
     * Emit {ExtendedTicket} events
     */
    function extendTicket(uint256 _times) external payable validTimesAndCosts(_times) validTicket(_msgSender()) {
        ticketOf[_msgSender()].times += _times;

        emit ExtendedTicket(_msgSender(), _times);
    }

    /**
     * @dev Get information of user ticket!
     * @param _account The address of user's ticket
     * @return The ticket of user
     */
    function getTicketOf(address _account) external view returns (UserTicket memory) {
        return ticketOf[_account];
    }

    /**
     * @dev Set price per times to play
     * @param _newPrice New price for each time to bet (> 0)
     * emit {SetPricePerTime} events
     */
    function setPricePerTime(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, 'New price must be greater than 0!');
        pricePerTime = _newPrice;
        emit SetPricePerTime(_newPrice);
    }
}
