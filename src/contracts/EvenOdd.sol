// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165CheckerUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/security/PullPaymentUpgradeable.sol';
import './interfaces/ICash.sol';
import './interfaces/ICashManager.sol';
import './interfaces/ITicketManager.sol';

contract EvenOdd is OwnableUpgradeable, ReentrancyGuardUpgradeable {
    struct Player {
        uint256 ticketId;
        bool isOdd;
        uint256 bet;
        bool isRewarded;
    }

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

    event Betted(address indexed _account, uint256 indexed _gameId, uint256 _amount);
    event Played(uint256 indexed _gameId, bool _isOdd);
    event Received(address indexed _from, uint256 _amount);
    event SuppliedToken(address indexed _from, uint256 _amount);
    event WithDrawnRefund(address indexed _to, uint256 indexed _matchId, uint256 _refund);

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
            'Invalid Cash Manager contract'
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
     * @dev Test for cases that contract directly receive eth
     */
    receive() external payable {
        require(msg.value > 0, 'Value must be more than zero!');
        emit Received(_msgSender(), msg.value);
    }

    /**
     * @dev Supply token to contract
     * Emit {SuppliedToken} events
     */
    function supplyToken() external payable onlyOwner {
        require(msg.value > 0, 'Value must be more than zero!');
        cashManager.buy{value: msg.value}();

        emit SuppliedToken(_msgSender(), msg.value);
    }

    /**
     * @dev Bet in a game
     * @param _isOdd (true/false) the result that user betted
     * @param _amount The amount of token that user betteds
     * emit {Betted} events
     */
    function bet(bool _isOdd, uint256 _amount) external nonReentrant {
        require(_amount > 0, 'Value must be more than zero!');

        _validateBeforeBetting(_amount);

        require(cash.transferFrom(_msgSender(), address(this), _amount), 'Transfer betted cash is not successful!');
        require(totalCashBetted += _amount > totalCashBetted, 'Overflow betted cash!');
        totalCashBetted += _amount;
        ticketManager.subtractTimes(_msgSender());
        
        uint256 playerTicketId = ticketManager.getTicketId(_msgSender());
        Player memory newPlayer = Player({
            ticketId: playerTicketId,
            isOdd: _isOdd,
            bet: _amount,
            isRewarded: false
        });

        playerList[lastMatch][playerTicketId] = newPlayer;

        emit Betted(_msgSender(), lastMatch, _amount);
    }

    /**
     * @dev Play a new game
     * @notice Only owner can play a new game
     * emit {Played} events
     */
    function play() external onlyOwner {
        _roll();
        _endGame();

        emit Played(lastMatch - 1, matchList[lastMatch - 1].isOdd);
    }

    /**
     * @dev Validate conditions of user before betting
     *      include whether user has already bought ticket, whether user has already betted befire,
     *      or balance of user is enough to bet, and the balance of contract is enough to reward
     * @param _amount number of ERC20 that user has betted
     */
    function _validateBeforeBetting(uint256 _amount) private view {
        // Checking whether user has already bought ticket
        uint256 ticketId = ticketManager.getTicketId(_msgSender());
        require(ticketId != 0, 'This user does not have ticket. Please buy a one to play');

        bool isExpired = ticketManager.isExpired(_msgSender());
        require(isExpired != true, "This user's ticket is expired. Please buy a new one to play");

        // Checking whether user has already betted before
        Player memory player = playerList[lastMatch][ticketId];
        require(player.ticketId != ticketId, 'This user has betted before!');

        // Checking balance of user is enough to bet, and the balance of contract is enough to reward
        require(cash.balanceOf(_msgSender()) >= _amount, "User's balance is not enough to bet");
        
        require(totalCashBetted += _amount > totalCashBetted, 'Overflow betted cash!');
        uint256 totalCashReward = (totalCashBetted + _amount) * 2;
        require(
            totalCashReward <= (cash.balanceOf(address(this)) + _amount),
            'Contract is not enough cash to reward if user win'
        );
    }

    /**
     * @dev Rolling 2 result of the game
     */
    function _roll() private {
        uint256 roll1 = ((block.timestamp % 15) + block.difficulty * 2) - block.number / 3;
        uint256 roll2 = (((block.timestamp / block.chainid + 5) % 23) + block.number * 2 + block.difficulty) / 4;

        matchList[lastMatch].roll1 = uint256(roll1 % 6) + 1;
        matchList[lastMatch].roll2 = uint256(roll2 % 6) + 1;
    }

    /**
     * @dev Calculate the result of game and reward token to users
     *      Increase matchId by 1
     */
    function _endGame() private {
        Match memory currentMatch = matchList[lastMatch];
        bool isOdd = (currentMatch.roll1 + currentMatch.roll2) % 2 == 1;
        matchList[lastMatch].isOdd = isOdd;

        totalCashBetted = 0;
        ++lastMatch;
    }

    /**
     * @dev Withdraw refund for user
     *      Prevent DoS Block Gas Limit
     * @param _matchId Id of the match that user wants to withdraw
     * emit {WithDrawnRefund} events
     */
    function withdrawRefund(uint256 _matchId) external nonReentrant {
        uint256 playerTicketId = ticketManager.getTicketId(_msgSender());
        Player memory player = playerList[_matchId][playerTicketId];
        Match memory targetMatch = matchList[_matchId];

        require(!player.isRewarded, 'Player has been withdrawn this game!');
        playerList[_matchId][playerTicketId].isRewarded = true;

        require(player.isOdd == targetMatch.isOdd, 'Player does not win this game!');
        bool success = cash.transfer(_msgSender(), player.bet * 2);

        require(success, 'Refund cash is not successful');
        emit WithDrawnRefund(_msgSender(), _matchId, player.bet * 2);
    }
}
