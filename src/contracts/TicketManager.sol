// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165CheckerUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol';
import './interfaces/ITicket.sol';
import './interfaces/ICashManager.sol';
import './interfaces/ITicketManager.sol';

contract TicketManager is OwnableUpgradeable, ERC165Upgradeable, ITicketManager {
    /**
     * @notice Ticket contract interface
     *      Used this contract to mint ERC721
     */
    ITicket public ticket;

    /**
     * @notice Cash contract interface
     *      Using this contract to mint and burn ERC20 token
     */
    ICashManager public cashManager;

    /**
     * @notice Address of deployer to withdraw native tokens
     */
    address public deployer;

    uint256 public lastTicket;
    uint256 public pricePerTime;

    /**
     * @notice Save list user's tickets
     */
    mapping(address => UserTicket) public ticketOf;

    event Bought(address indexed _account, uint256 _times, uint256 indexed _ticketId);
    event SubTractedTimes(address indexed _account, uint256 _remainTimes);
    event ExtendedTicket(address indexed _account, uint256 _times);
    event SetPricePerTime(uint256 indexed _price);
    event WithdrawnToDeployer(address indexed _account, uint256 indexed _amount);

    /**
     * @notice Modifier used to check the msg.value
     * @param _times The times want to buy or extend
     */
    modifier validTimesAndCosts(uint256 _times) {
        require(_times > 0, 'Invalid times!');
        require(msg.value == pricePerTime * _times, 'Invalid fee!');
        _;
    }

    /**
     * @notice Modifier used to check the user has bought the ticket
     * @param _account The address want to check
     */
    modifier validTicket(address _account) {
        require(_account != address(0), 'Invalid address!');
        UserTicket memory userTicket = ticketOf[_account];
        require(userTicket.ticketId != 0, 'Invalid ticket!');
        _;
    }

    /**
     * @notice Replace for constructor function in order to be upgradeable
     * @param _ticketAddress Address of contract Ticket
     */
    function initialize(ITicket _ticketAddress, ICashManager _cashManagerAddress) public initializer {
        __Ownable_init();
        __ERC165_init();

        require(
            ERC165CheckerUpgradeable.supportsInterface(address(_ticketAddress), type(ITicket).interfaceId),
            'Invalid Ticket contract'
        );

        require(
            ERC165CheckerUpgradeable.supportsInterface(address(_cashManagerAddress), type(ICashManager).interfaceId),
            'Invalid Cash contract'
        );

        ticket = _ticketAddress;
        cashManager = _cashManagerAddress;
        pricePerTime = 10**18 / (cashManager.ethToCash() * 10);
        deployer = _msgSender();
    }

    /**
     * @notice Override function `supportsInterface` when using ERC165
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
     * @notice Buy a ticket to play game. 0.1 eth -> 1 ticket
     * Emit {Bought} events
     */
    function buy(uint256 _times) external payable validTimesAndCosts(_times) {
        require(ticketOf[_msgSender()].ticketId == 0, 'Already bought ticket!');
        ticket.mint(_msgSender(), ++lastTicket);

        UserTicket memory newUserTicket = UserTicket(lastTicket, _times);
        ticketOf[_msgSender()] = newUserTicket;


        emit Bought(_msgSender(), _times, lastTicket);  
    }

    /**
     * @notice Subtract times of ticket of user
     * @param _account Address of user whom we subtract times ticket of
     * Emit {SubtractedTimes} events
     */
    function subtractTimes(address _account) external onlyOwner validTicket(_account) {
        require(ticketOf[_account].times > 0, 'Ticket is out of times!');

        ticketOf[_account].times -= 1;

        emit SubTractedTimes(_account, ticketOf[_account].times);
    }

    /**
     * @notice Extend ticket when it was expired
     * @param _times The time that user want to extend
     * Emit {ExtendedTicket} events
     */
    function extendTicket(uint256 _times) external payable validTimesAndCosts(_times) validTicket(_msgSender()) {
        ticketOf[_msgSender()].times += _times;
        emit ExtendedTicket(_msgSender(), _times);
    }

    /**
     * @notice Get information of user ticket!
     * @param _account The address of user's ticket
     * @return The ticket of user
     */
    function getTicketOf(address _account) external view returns (UserTicket memory) {
        return ticketOf[_account];
    }

    /**
     * @notice Set price per times to play
     * @param _newPrice New price for each time to bet (> 0)
     * emit {SetPricePerTime} events
     */
    function setPricePerTime(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, 'New price must be greater than 0!');
        pricePerTime = _newPrice;
        emit SetPricePerTime(_newPrice);
    }

    /**
     * @notice Withdraw native tokens to deployer
     * emit { WithdrawnToDeployer } events
     */
    function withdrawToDeployer() external {
        require(_msgSender() == deployer, 'Not allowed!');
        uint256 _amount = address(this).balance;
        AddressUpgradeable.sendValue(payable(deployer), _amount);
        
        emit WithdrawnToDeployer(deployer, _amount); 
    }
}
