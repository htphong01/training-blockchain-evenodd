// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165CheckerUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol';
import './interfaces/ICash.sol';
import './interfaces/ICashManager.sol';

contract CashManager is OwnableUpgradeable, ReentrancyGuardUpgradeable, ERC165Upgradeable, ICashManager {
    /**
     * @dev Cash contract interface
     *      Using this contract to mint and burn ERC20 token
     */
    ICash public cash;

    event Bought(address indexed _account, uint256 _amount);
    event Withdrawn(address indexed _account, uint256 _amount);
    event SetPricePerCash(uint256 indexed _rate);

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
     * Emit {Bought} events
     */
    function buy() external payable {
        cash.mint(_msgSender(), msg.value);
        
        emit Bought(_msgSender(), msg.value);
    }

    /**
     * @dev Withdraw amount of cash that user wants
     * @param _amount - Number of cashes that user wants to withdraw
     * emit {Withdrawn} events
     */
    function withdraw(uint256 _amount) external nonReentrant {
        cash.burn(_msgSender(), _amount);
        AddressUpgradeable.sendValue(payable(_msgSender()), _amount);

        emit Withdrawn(_msgSender(), _amount);
    }
}
