// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ICash.sol";
import "./interfaces/ITicket.sol";
import "hardhat/console.sol";

contract EvenOdd is Ownable, ReentrancyGuard {
    struct Player {
        uint256 ticketId;
        bool isOdd;
        uint256 bet;
    }

    struct Match {
        uint256 roll1;
        uint256 roll2;
    }

    ICash private _cashManager;
    ITicket private _ticketManager;

    uint256 public latestedMatchId;
    mapping(uint256 => Player[]) public playerList; // each match has multiple players, find by match id
    mapping(uint256 => Match) public matchList;

    event Betted(address _userAddress, uint256 _gameId, uint256 _amount);
    event EndedGame(uint256 _gameId, bool _result);
    event Received(uint256 _amount);

    constructor(address cashAddress, address ticketAddress) payable {
        _cashManager = ICash(cashAddress);
        _ticketManager = ITicket(ticketAddress);

        _cashManager.buy{value: msg.value}();
    }

    receive() external payable {
        emit Received(msg.value);
    }

    fallback() external payable {
        require(msg.data.length == 0);
        
    }

    /**
     * This function is used to bet in a game
     * @param isOdd - (true/false) the result that user betted
     * @param amount - The amount of token that user betteds
     */
    function bet(bool isOdd, uint256 amount) external nonReentrant {
        _checkTicket();
        _checkAlreadyBet();
        _checkCashBalance(amount);

        _cashManager.transferFrom(msg.sender, address(this), amount);
        _ticketManager.subtractTimes(_msgSender());
        Player memory newPlayer = Player({
            ticketId: _ticketManager.getTicketId(msg.sender),
            isOdd: isOdd,
            bet: amount
        });

        playerList[latestedMatchId].push(newPlayer);

        emit Betted(msg.sender, latestedMatchId, amount);
    }

    /**
     * Play a new game
     * Only owner can play
     */
    function play() external onlyOwner {
        _roll();
        _endGame();
        _nextGame();
    }

    /** 
     * Checking a ticket is available
     */
    function _checkTicket() private view {
        uint256 ticketId = _ticketManager.getTicketId(_msgSender());
        require(
            ticketId != 0,
            "This user does not have ticket. Please buy a one to play"
        );

        bool isExpired = _ticketManager.isExpired(_msgSender());
        require(
            isExpired != true,
            "This user's ticket is expired. Please buy a new one to play"
        );
    }

    /**
     * Checking that user has already betted before
     */
    function _checkAlreadyBet() private view {
        uint256 ticketId = _ticketManager.getTicketId(_msgSender());
        Player[] memory players = playerList[latestedMatchId];

        for (uint256 i = 0; i < players.length; i++) {
            require(
                players[i].ticketId != ticketId,
                "This user has bet before!"
            );
        }
    }

    /**
     * Checking that balance is enough to bet or the balance of contract is enought to reward
     * @param amount - The amount of token that user betted
     */
    function _checkCashBalance(uint256 amount) private view {
        require(
            _cashManager.balanceOf(_msgSender()) >= amount,
            "User's balance is not enough to bet"
        );

        Player[] memory players = playerList[latestedMatchId];
        uint256 totalCashBetted = 0;
        for (uint256 i = 0; i < players.length; i++) {
            totalCashBetted = totalCashBetted + players[i].bet;
        }

        uint256 totalCashReward = (totalCashBetted + amount) * 2;
        require(
            totalCashReward <= (_cashManager.balanceOf(address(this)) + amount),
            "Contract is not enough cash to reward if user win"
        );
    }

    /**
     * Rolling 2 result of the game
     */
    function _roll() private onlyOwner {
        uint256 roll1 = ((block.timestamp % 15) + block.difficulty * 2) -
            block.number /
            3;
        uint256 roll2 = (((block.timestamp / block.chainid + 5) % 23) +
            block.number *
            2 +
            block.difficulty) / 4;

        matchList[latestedMatchId].roll1 = uint256(roll1 % 6) + 1;
        matchList[latestedMatchId].roll2 = uint256(roll2 % 6) + 1;
    }

    /**
     * Calculate the result of game and reward token to users
     */
    function _endGame() private onlyOwner {
        Player[] memory players = playerList[latestedMatchId];
        Match memory currentMatch = matchList[latestedMatchId];
        bool isOdd = (currentMatch.roll1 + currentMatch.roll2) % 2 == 1;

        for (uint i = 0; i < players.length; i++) {
            if(players[i].isOdd == isOdd) {
                _cashManager.transfer(_ticketManager.ownerOf(players[i].ticketId), players[i].bet * 2);
            }
        }

        emit EndedGame(latestedMatchId, isOdd);
    }

    function _nextGame() private onlyOwner {
        ++latestedMatchId;
    }
}
