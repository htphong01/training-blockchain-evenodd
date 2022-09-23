// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol';
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import './interfaces/ICash.sol';

contract Cash is ERC165Upgradeable, ERC20Upgradeable, OwnableUpgradeable, ICash {

    event Minted(address indexed _account, uint256 _amount);
    event Burned(address indexed _account, uint256 _amount);

    /**
     * @dev Modifier to check that the account's address is Zero address
     * @param _account Address of account to check
     */
    modifier notZeroAddress(address _account) {
        require(_account != address(0), 'Address is not valid!');
        _;
    }

    /**
     * @dev Modifier to check that the value is greater than zero 
     * @param _value Value to check
     */
    modifier greaterThanZero(uint256 _value) {
        require(_value > 0, 'Value must be greater than 0!');
        _;
    }

    /**
     * @dev Replace for constructor function in order to be upgradeable
     */
    function initialize() initializer public {
        __ERC20_init('Cash', 'C');
        __Ownable_init();
        __ERC165_init();
    }

    /**
     * @dev Override function `supportsInterface` when using ERC165
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165Upgradeable, IERC165Upgradeable) returns (bool) {
        return interfaceId == type(ICash).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Used to mint ERC20 token for user
     * @param _account Address of user's account
     * @param _amount Amount of token that user will receive
     */
    function mint(address _account, uint256 _amount) external onlyOwner notZeroAddress(_account) greaterThanZero(_amount) {
        _mint(_account, _amount);

        emit Minted(_account, _amount);
    }

    /**
     * @dev Used to burn ERC20 token when user withdraw
     * @param _account Address of user's account
     * @param _amount Amount of token that user will withdraw
     */
    function burn(address _account, uint256 _amount) external onlyOwner notZeroAddress(_account) greaterThanZero(_amount) {
        _burn(_account, _amount);

        emit Burned(_account, _amount);
    }
}
