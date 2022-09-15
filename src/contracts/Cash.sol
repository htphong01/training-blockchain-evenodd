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

    function mint(address _account, uint256 _amount) onlyOwner external {
        _mint(_account, _amount);
    }

    function burn(address _account, uint256 _amount) onlyOwner external {
        _burn(_account, _amount);
    }

    function setOwner(address _newOwner) external onlyOwner {
        _transferOwnership(_newOwner);
    }
}
