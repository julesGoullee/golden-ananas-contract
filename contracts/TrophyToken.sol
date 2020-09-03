// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "./openzeppelin/ERC721.sol";
import "./openzeppelin/AccessControl.sol";


contract TrophyToken is ERC721, AccessControl {

  constructor (string memory _name, string memory _symbol) ERC721(_name, _symbol) public {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  function mint(address to, uint256 tokenId) public {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "TrophyToken: Sender must have admin role");
    _safeMint(to, tokenId, "");
  }

}
