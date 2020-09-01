// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.12;

import "./openzeppelin/Roles.sol";

contract AdminRole {

  using Roles for Roles.Role;

  event AdminAdded(address indexed account);
  event AdminRemoved(address indexed account);

  Roles.Role private _admin;

  constructor () internal {
    _addAdmin(msg.sender);
  }

  modifier onlyAdmin() {
    require(isAdmin(msg.sender), "AdminRole: caller does not have the Admin role");
    _;
  }

  function isAdmin(address account) public view returns (bool) {
    return _admin.has(account);
  }

  function addAdmin(address account) public onlyAdmin {
    _addAdmin(account);
  }

  function renounceAdmin() public {
    _removeAdmin(msg.sender);
  }

  function _addAdmin(address account) internal {
    _admin.add(account);
    emit AdminAdded(account);
  }

  function _removeAdmin(address account) internal {
    _admin.remove(account);
    emit AdminRemoved(account);
  }
}
