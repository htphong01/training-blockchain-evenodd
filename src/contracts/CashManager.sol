// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165CheckerUpgradeable.sol";
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol';
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import './interfaces/ICash.sol';
import './interfaces/ICashManager.sol';

contract CashManager is ERC165Upgradeable, ReentrancyGuardUpgradeable, OwnableUpgradeable, ICashManager {
    event Bought(address indexed _account, uint256 _amount);
    event Withdrawn(address indexed _account, uint256 _amount);
    event SetRateConversion(uint256 indexed _rate);

    uint256 public rateConversion; // 1 wei -> 1 cash

    /**
     * @dev Cash contract interface
     *      Using this contract to mint and burn ERC20 token
     */
    ICash public cash;

    function initialize(ICash _cashAddress) initializer public {
        __Ownable_init();
        __ReentrancyGuard_init();
        __ERC165_init();
        
        require(
            ERC165CheckerUpgradeable.supportsInterface(address(_cashAddress), type(ICash).interfaceId), 
            'Invalid Cash contract'
        );
        cash = _cashAddress;
        rateConversion = 1;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165Upgradeable, IERC165Upgradeable) returns (bool) {
        return interfaceId == type(ICashManager).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Buy cashes (ERC20) to play game. 1 wei = 1 cash
     * Emit {Bought} events
     */
    function buy() external payable {
        require(msg.value > 0, 'The amount of token that will be bought must be greater than 0');
        uint256 amount = msg.value / rateConversion;
        cash.mint(_msgSender(), amount);
        emit Bought(_msgSender(), amount);
    }

    /**
     * @dev Withdraw amount of cash that user wants
     * @param _amount - Number of cashes that user wants to withdraw
     * emit {Withdrawn} events
     */
    function withdraw(uint256 _amount) external nonReentrant {
        require(_amount > 0, 'Amount is must be greater than 0!');
        cash.burn(_msgSender(), _amount);
        AddressUpgradeable.sendValue(payable(_msgSender()), _amount * rateConversion);
        emit Withdrawn(_msgSender(), _amount);
    }

    /**
     * @dev Set rate of conversion between eth and cash
     * @param _rate The rate of conversion
     * Emit {SetRateConversion} events
     */
    function setRateConversion(uint256 _rate) external onlyOwner {
        require(_rate > 0, 'Rate must be greater than zero');
        rateConversion = _rate;

        emit SetRateConversion(_rate);
    }
}