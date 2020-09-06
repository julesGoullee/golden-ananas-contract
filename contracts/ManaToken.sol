pragma solidity ^0.6.12;

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "./openzeppelin/ERC20.sol";
import "./openzeppelin/AccessControl.sol";


contract ManaToken is ERC20, AccessControl {

  constructor (string memory _name, string memory _symbol, uint256 _totalSupply) ERC20(_name, _symbol) public {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _mint(msg.sender, _totalSupply);
  }

}
