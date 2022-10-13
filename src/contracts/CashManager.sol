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
     * @notice Cash contract interface
     *      Using this contract to mint and burn ERC20 token
     */
    ICash public cash;

    uint256 public ethToCash;

    event Bought(address indexed _account, uint256 _amount);
    event Withdrawn(address indexed _account, uint256 _amount);
    event SetETHToCash(uint256 indexed _amount);

    /**
     * @notice Replace for constructor function in order to be upgradeable
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
        ethToCash = 100;
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
        return interfaceId == type(ICashManager).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @notice Buy cashes (ERC20) to play game. 1 wei = 1 cash
     * Emit {Bought} events
     */
    function buy() external payable {
        uint256 _amount = msg.value * (10 ** cash.decimals()) * ethToCash / (10 ** 18);
        cash.mint(_msgSender(), _amount);
        
        emit Bought(_msgSender(), _amount);
    }

    /**
     * @notice Withdraw amount of cash that user wants
     * @param _amount - Number of cashes that user wants to withdraw
     * emit {Withdrawn} events
     */
    function withdraw(uint256 _amount) external nonReentrant {
        uint256 refund = _amount * (10 ** 18) / (ethToCash * 10 ** cash.decimals());
        cash.burn(_msgSender(), _amount);
        AddressUpgradeable.sendValue(payable(_msgSender()), refund);

        emit Withdrawn(_msgSender(), _amount);
    }

    /**
     * @notice Set ETH to cash
     * @param _amount - Number of cashes that 1 ETH equal to
     * emit {SetETHToCash} events
     */
    function setETHToCash(uint256 _amount) external onlyOwner {
        require(_amount > 0 && _amount <= 10**18, 'Invalid amount!');
        ethToCash = _amount;
        emit SetETHToCash(_amount);
    }
}
