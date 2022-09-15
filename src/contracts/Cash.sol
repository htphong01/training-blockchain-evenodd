// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol';
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import './interfaces/ICash.sol';

contract Cash is ERC165Upgradeable, ERC20Upgradeable, OwnableUpgradeable, ICash {

    function initialize() initializer public {
        __ERC20_init('Cash', 'C');
        __Ownable_init();
        __ERC165_init();
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165Upgradeable, IERC165Upgradeable) returns (bool) {
        return interfaceId == type(ICash).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Used to mint ERC20 token for user
     * @param _account Address of user's account
     * @param _amount Amount of token that user will receive
     */
    function mint(address _account, uint256 _amount) onlyOwner external {
        require(_account != address(0), 'Address is not valid!');
        require(_amount > 0, 'Amount is must be greater than 0!');
        _mint(_account, _amount);
    }

    /**
     * @dev Used to burn ERC20 token when user withdraw
     * @param _account Address of user's account
     * @param _amount Amount of token that user will withdraw
     */
    function burn(address _account, uint256 _amount) onlyOwner external {
        require(_account != address(0), 'Address is not valid!');
        require(_amount > 0, 'Amount is must be greater than 0!');
        _burn(_account, _amount);
    }

    /**
     * @dev Used to set new owner of the contract
     * @param _newOwner Address of new owner
     */
    function setOwner(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), 'Address is not valid!');
        _transferOwnership(_newOwner);
    }
}
