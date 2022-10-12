// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.9;

import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165CheckerUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/security/PullPaymentUpgradeable.sol';
import './interfaces/ICash.sol';
import './interfaces/ICashManager.sol';
import './interfaces/ITicketManager.sol';

contract EvenOdd is OwnableUpgradeable, ReentrancyGuardUpgradeable {

    /**
     * @dev struct for storing player's information in game
     */
    struct Player {
        uint256 ticketId;
        bool isOdd;
        uint256 bet;
        bool isRewarded;
    }

    /**
     * @dev struct for storing information of a game
     */
    struct Match {
        uint256 roll1;
        uint256 roll2;
        bool isOdd;
    }
    /**
     * @dev Cash contract interface
     *      Used to call function of ERC20
     */
    ICash public cash;

    /**
     * @dev CashManager contract interface
     *      Used to manage cashes (ERC20 token) of users
     */
    ICashManager public cashManager;

    /**
     * @dev TicketManager contract interface
     *      Used to manage ticket (ERC721) of users
     */
    ITicketManager public ticketManager;

    uint256 public lastMatch;
    uint256 public totalCashBetted;

    mapping(uint256 => mapping(uint256 => Player)) public playerList; // each match has multiple players (mapping by ticketId), find by match id
    mapping(uint256 => Match) public matchList;

    event Received(address indexed _from, uint256 _amount);
    event Betted(address indexed _account, uint256 indexed _gameId, bool indexed _isOdd, uint256 _amount);
    event Played(uint256 indexed _matchId, bool _isOdd);
    event SuppliedToken(address indexed _from, uint256 _amount);
    event WithDrawn(address indexed _to, uint256 indexed _matchId, uint256 _amount);

    /**
     * @dev Modifier to check that the account's address is Zero address
     * @param _value Amount to check
     */
    modifier validValue(uint256 _value) {
        require(_value > 0, 'Invalid value!');
        _;
    }

    /**
     * @dev Replace for constructor function in order to be upgradeable
     * @param _cashAddress Address of contract Cash
     * @param _cashManagerAddress Address of contract CashManager
     * @param _ticketManagerAddress Address of contract TicketManager
     */
    function initialize(
        ICash _cashAddress,
        ICashManager _cashManagerAddress,
        ITicketManager _ticketManagerAddress
    ) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        require(
            ERC165CheckerUpgradeable.supportsInterface(address(_cashAddress), type(ICash).interfaceId),
            'Invalid Cash contract'
        );
        require(
            ERC165CheckerUpgradeable.supportsInterface(address(_cashManagerAddress), type(ICashManager).interfaceId),
            'Invalid Cash Manager contract'
        );
        require(
            ERC165CheckerUpgradeable.supportsInterface(
                address(_ticketManagerAddress),
                type(ITicketManager).interfaceId
            ),
            'Invalid Ticket Manager contract'
        );

        cash = _cashAddress;
        cashManager = _cashManagerAddress;
        ticketManager = _ticketManagerAddress;
    }

    /**
     * @dev Test for cases that contract directly receive eth without data
     */
    receive() external payable validValue(msg.value) {
        emit Received(_msgSender(), msg.value);
    }

    /**
     * @dev Supply token to contract
     * Emit {SuppliedToken} events
     */
    function supplyToken() external payable onlyOwner {
        uint256 _amount = msg.value * 10 ** cashManager.ethToCash() / 10**18;
        cashManager.buy{value: msg.value}();

        emit SuppliedToken(_msgSender(), _amount);
    }

    /**
     * @dev Bet in a game
     * @param _isOdd (true/false) the result that user betted
     * @param _amount The amount of token that user betteds
     * emit {Betted} events
     */
    function bet(bool _isOdd, uint256 _amount) external nonReentrant validValue(_amount) {
        // Checking whether user has already bought ticket
        UserTicket memory userTicket = ticketManager.getTicketOf(_msgSender());
        uint256 ticketId = userTicket.ticketId;
        require(ticketId != 0, 'Invalid ticket!');

        require(userTicket.times != 0, "Ticket is out of times!");

        // Checking whether user has already betted before
        Player memory player = playerList[lastMatch][ticketId];
        require(player.ticketId != ticketId, 'Betted before!');

        // Checking balance of user is enough to bet, and the balance of contract is enough to reward
        require(cash.balanceOf(_msgSender()) >= _amount, "Exceeds balance!");

        require(totalCashBetted + _amount > totalCashBetted, 'Overflow!');
        uint256 totalCashReward = (totalCashBetted + _amount) * 2;
        require(
            totalCashReward <= (cash.balanceOf(address(this)) + _amount),
            'Not enough to reward!'
        );

        require(cash.transferFrom(_msgSender(), address(this), _amount), 'Transfer not successful!');
        totalCashBetted += _amount;
        ticketManager.subtractTimes(_msgSender());
        
        Player memory newPlayer = Player({
            ticketId: ticketId,
            isOdd: _isOdd,
            bet: _amount,
            isRewarded: false
        });
        playerList[lastMatch][ticketId] = newPlayer;

        emit Betted(_msgSender(), lastMatch, _isOdd, _amount);
    }

    /**
     * @dev Play a new game, roll 2 dice, get result is odd or even
     * @notice Only owner can play a new game
     * emit {Played} events
     */
    function play() external onlyOwner {
        uint256 roll1 = ((block.timestamp % 15) + block.difficulty * 2) + block.number / 3;
        uint256 roll2 = (((block.timestamp / block.chainid + 5) % 23) + block.number * 2 + block.difficulty) / 4;

        Match memory newMatch = Match({
            roll1: uint256(roll1 % 6) + 1,
            roll2: uint256(roll2 % 6) + 1,
            isOdd: (roll1 + roll2) % 2 == 1
        });

        matchList[lastMatch] = newMatch;

        totalCashBetted = 0;
        ++lastMatch;
        
        emit Played(lastMatch - 1, newMatch.isOdd);
    }

    /**
     * @dev Withdraw refund for user
     *      Prevent DoS Block Gas Limit
     * @param _matchId Id of the match that user wants to withdraw
     * emit {WithDrawnRefund} events
     */
    function withdraw(uint256 _matchId) external nonReentrant {
        require(_matchId < lastMatch, 'Invalid match!');
        uint256 playerTicketId = ticketManager.getTicketOf(_msgSender()).ticketId;
        Player memory player = playerList[_matchId][playerTicketId];

        require(!player.isRewarded, 'Has been withdrawn this game!');
        playerList[_matchId][playerTicketId].isRewarded = true;

        Match memory targetMatch = matchList[_matchId];
        require(player.isOdd == targetMatch.isOdd, 'Does not win this game!');
        bool success = cash.transfer(_msgSender(), player.bet * 2);

        require(success, 'Withdraw not successful');
        emit WithDrawn(_msgSender(), _matchId, player.bet * 2);
    }
}
