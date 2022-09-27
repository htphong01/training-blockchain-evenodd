// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165CheckerUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol';
import './interfaces/ICash.sol';
import './interfaces/ICashManager.sol';

contract CashManager is ERC165Upgradeable, ReentrancyGuardUpgradeable, OwnableUpgradeable, ICashManager {
    /**
     * @dev Cash contract interface
     *      Using this contract to mint and burn ERC20 token
     */
    ICash public cash;

    /**
     * @dev The rate when exchange between wei and cash
     */
    uint256 public pricePerCash; // default:  1 wei -> 1 cash

    event Bought(address indexed _account, uint256 _amount);
    event Withdrawn(address indexed _account, uint256 _amount);
    event SetPricePerCash(uint256 indexed _rate);

    /**
     * @dev Modifier to check that the value is valid (use for ERC20)
     * @param _value Value to check
     */
    modifier validAmountCash(uint256 _value) {
        require(_value * (10 ** cash.getDecimals()) >= 1 , 'Invalid amount!');
        _;
    }

    /**
     * @dev Replace for constructor function in order to be upgradeable
     * @param _cashAddress Address of contract Cash
     */
    function initialize(ICash _cashAddress) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        __ERC165_init();

        require(
            ERC165CheckerUpgradeable.supportsInterface(address(_cashAddress), type(ICash).interfaceId),
            'Invalid Cash contract'
        );
        cash = _cashAddress;
        pricePerCash = 1;
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
        return interfaceId == type(ICashManager).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Buy cashes (ERC20) to play game. 1 wei = 1 cash
     * @param _amount - Number of cashes that user wants to buy
     * Emit {Bought} events
     */
    function buy(uint256 _amount) external payable validAmountCash(_amount) {
        require(msg.value * 10**cash.getDecimals() / pricePerCash  == _amount, 'You must pay enough fee!');
        cash.mint(_msgSender(), _amount);
        
        emit Bought(_msgSender(), _amount / 10**cash.getDecimals());
    }

    /**
     * @dev Withdraw amount of cash that user wants
     * @param _amount - Number of cashes that user wants to withdraw
     * emit {Withdrawn} events
     */
    function withdraw(uint256 _amount) external nonReentrant validAmountCash(_amount) {
        cash.burn(_msgSender(), _amount);
        uint256 refund = _amount * pricePerCash / (10**cash.getDecimals());
        AddressUpgradeable.sendValue(payable(_msgSender()), refund);

        emit Withdrawn(_msgSender(), refund);
    }

    /**
     * @dev Set price per cash
     * @param _newPrice new price per cash
     * emit {SetPricePerCash} events
     */
    function setPricePerCash(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, 'New price must be greater than 0!');
        pricePerCash = _newPrice;
        emit SetPricePerCash(_newPrice);
    }
}
