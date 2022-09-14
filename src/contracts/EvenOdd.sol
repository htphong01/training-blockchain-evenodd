// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./interfaces/ICashManager.sol";
import "./interfaces/ITicketManager.sol";

contract EvenOdd is OwnableUpgradeable, ReentrancyGuardUpgradeable {

    event Betted(address indexed _account, uint256 indexed _gameId, uint256 _amount);
    event Played(uint256 indexed _gameId, bool _isOdd);
    event Received(address indexed _from, uint256 _amount);

    struct Player {
        uint256 ticketId;
        bool isOdd;
        uint256 bet;
    }

    struct Match {
        uint256 roll1;
        uint256 roll2;
        bool isOdd;
    }
    IERC20Upgradeable public cash;
    ICashManager public cashManager;
    ITicketManager public ticketManager;

    uint256 public latestMatchId;
    mapping(uint256 => Player[]) public playerList; // each match has multiple players, find by match id
    mapping(uint256 => Match) public matchList;

    function initialize(IERC20Upgradeable _cashAddress, ICashManager _cashManagerAddress, ITicketManager _ticketManagerAddress) initializer public {
        cash = _cashAddress;
        cashManager = _cashManagerAddress;
        ticketManager = _ticketManagerAddress;
        __Ownable_init();
        __ReentrancyGuard_init();
    }

    receive() external payable {
        require(msg.value > 0, 'Value must be more than zero!');
        emit Received(_msgSender(), msg.value);
    }

    /**
     * This function is used to supply token to contract
     */
    function supplyToken() external payable onlyOwner {
        cashManager.buy{ value: msg.value }();
    }

    /**
     * This function is used to bet in a game
     * @param _isOdd - (true/false) the result that user betted
     * @param _amount - The amount of token that user betteds
     */
    function bet(bool _isOdd, uint256 _amount) external nonReentrant {
        _validateBeforeBetting(_amount);
        cash.transferFrom(msg.sender, address(this), _amount);
        ticketManager.subtractTimes(_msgSender());
        Player memory newPlayer = Player({
            ticketId: ticketManager.getTicketId(_msgSender()),
            isOdd: _isOdd,
            bet: _amount
        });

        playerList[latestMatchId].push(newPlayer);

        emit Betted(_msgSender(), latestMatchId, _amount);
    }

    /**
     * Play a new game
     * Only owner can play
     */
    function play() external onlyOwner {
        _roll();
        _endGame();
        _nextGame();

        emit Played(latestMatchId - 1, matchList[latestMatchId - 1].isOdd);
    }

    /**
     * @dev Validate conditions of user before betting
     * include whether user has already bought ticket, whether user has already betted befire,
     * or balance of user is enough to bet, and the balance of contract is enough to reward
     * @param _amount number of ERC20 that user has betted
     */
    function _validateBeforeBetting(uint256 _amount) private view {
        // Checking whether user has already bought ticket
        uint256 ticketId = ticketManager.getTicketId(_msgSender());
        require(
            ticketId != 0,
            "This user does not have ticket. Please buy a one to play"
        );

        bool isExpired = ticketManager.isExpired(_msgSender());
        require(
            isExpired != true,
            "This user's ticket is expired. Please buy a new one to play"
        );

        // Checking whether user has already betted before
        Player[] memory players = playerList[latestMatchId];

        for (uint256 i = 0; i < players.length; i++) {
            require(
                players[i].ticketId != ticketId,
                "This user has betted before!"
            );
        }

        // Checking balance of user is enough to bet, and the balance of contract is enough to reward
        require(
            cash.balanceOf(_msgSender()) >= _amount,
            "User's balance is not enough to bet"
        );

        uint256 totalCashBetted = 0;
        for (uint256 i = 0; i < players.length; i++) {
            totalCashBetted = totalCashBetted + players[i].bet;
        }

        uint256 totalCashReward = (totalCashBetted + _amount) * 2;
        require(
            totalCashReward <= (cash.balanceOf(address(this)) + _amount),
            "Contract is not enough cash to reward if user win"
        );
    }

    /**
     * Rolling 2 result of the game
     */
    function _roll() private {
        uint256 roll1 = ((block.timestamp % 15) + block.difficulty * 2) -
            block.number /
            3;
        uint256 roll2 = (((block.timestamp / block.chainid + 5) % 23) +
            block.number *
            2 +
            block.difficulty) / 4;

        matchList[latestMatchId].roll1 = uint256(roll1 % 6) + 1;
        matchList[latestMatchId].roll2 = uint256(roll2 % 6) + 1;
    }

    /**
     * Calculate the result of game and reward token to users
     */
    function _endGame() private {
        Player[] memory players = playerList[latestMatchId];
        Match memory currentMatch = matchList[latestMatchId];
        bool isOdd = (currentMatch.roll1 + currentMatch.roll2) % 2 == 1;
        matchList[latestMatchId].isOdd = isOdd;

        for (uint i = 0; i < players.length; i++) {
            if(players[i].isOdd == isOdd) {
                cash.transfer(ticketManager.ownerOf(players[i].ticketId), players[i].bet * 2);
            }
        }
    }

    function _nextGame() private {
        ++latestMatchId;
    }
}
