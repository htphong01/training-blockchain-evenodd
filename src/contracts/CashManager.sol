// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165CheckerUpgradeable.sol";
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol';
import './interfaces/ICash.sol';
import './interfaces/ICashManager.sol';

contract CashManager is ERC165Upgradeable, ReentrancyGuardUpgradeable, OwnableUpgradeable, ICashManager {
    event Bought(address indexed _account, uint256 _amount);
    event Withdrawn(address indexed _account, uint256 _amount);

    uint256 public rateConversion; // 1 wei -> 1 cash

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
     * Buy some cashes to play game. 1 wei = 1 cash
     */
    function buy() external payable {
        require(msg.value > 0, 'The amount of token that will be bought must be greater than 0');
        uint256 amount = msg.value / rateConversion;
        cash.mint(_msgSender(), amount);
        emit Bought(_msgSender(), amount);
    }

    /**
     * Withdraw amount of cash that user wants
     * @param _amount - Number of cash that user wants to withdraw
     */
    function withdraw(uint256 _amount) external nonReentrant {
        cash.burn(_msgSender(), _amount);
        (bool success, ) = payable(_msgSender()).call{value: _amount * rateConversion}('');
        require(success, 'Withdraw not successful!');

        emit Withdrawn(_msgSender(), _amount);
    }

    /**
     * @dev Set rate of conversion between eth and cash
     * @param _rate The rate of conversion
     */
    function setRateConversion(uint256 _rate) external onlyOwner {
        require(_rate > 0, 'Rate must be greater than zero');
        rateConversion = _rate;
    }
}