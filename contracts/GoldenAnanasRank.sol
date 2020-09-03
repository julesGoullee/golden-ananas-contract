// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import "./openzeppelin/SafeMath.sol";
import "./openzeppelin/IERC20.sol";

import "./GoldenAnanasScore.sol";

contract GoldenAnanasRank is AccessControl {

  using SafeMath for uint;
  bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

  GoldenAnanasScore public goldenAnanasScore;
  address[] public ranks;
  mapping(uint256 => address[]) public ranksByLevel;
  uint256 public ranksSize;

  constructor(
    GoldenAnanasScore _goldenAnanasScore,
    uint256 _ranksSize
  ) public {

    goldenAnanasScore = _goldenAnanasScore;
    ranksSize = _ranksSize;
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(EXECUTOR_ROLE, msg.sender);

  }

  function setGoldenAnanasScore(GoldenAnanasScore _goldenAnanasScore) public {

    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "GoldenAnanasRank: Sender must have admin role");
    goldenAnanasScore = _goldenAnanasScore;

  }

  function updateAllRanks(uint256 _level, address _player) public {

    require(hasRole(EXECUTOR_ROLE, msg.sender), "GoldenAnanasRank: Sender must have executor role");
    updateRanksByLevel(_level, _player);
    updateRanks(_player);

  }

  function updateRanksByLevel(uint256 _level, address _player) public returns(bool) {

    require(hasRole(EXECUTOR_ROLE, msg.sender), "GoldenAnanasRank: Sender must have executor role");

    uint256 scoreLevel = goldenAnanasScore.getScoreByLevel(_level, _player);
    uint256 size = ranksByLevel[_level].length;

    if(ranksByLevel[_level].length == 0){

      ranksByLevel[_level].push(_player);

      return true;

    }

    if(ranksByLevel[_level].length == 1 && ranksByLevel[_level][0] == _player){

      return true;

    }

    for (uint i = 0; i < size; i++) {

      if(ranksByLevel[_level][i] == _player){

        if(i != ranksByLevel[_level].length -1){

          for (uint j = i; j < ranksByLevel[_level].length - 1; j++){

            ranksByLevel[_level][j] = ranksByLevel[_level][j + 1];

          }

        }

        ranksByLevel[_level].pop();
        size--;

      }

    }

    for (uint i = 0; i < size; i++) {

      if(goldenAnanasScore.getScoreByLevel(_level, ranksByLevel[_level][i]) > scoreLevel){

        if(ranksByLevel[_level].length < ranksSize){

          ranksByLevel[_level].push(address(0) );

        }

        for(uint j = ranksByLevel[_level].length -1; j > i; j--){

          ranksByLevel[_level][j] = ranksByLevel[_level][j -1];

        }

        ranksByLevel[_level][i] = _player;
        return true;

      }

    }

    if(ranksByLevel[_level].length <= ranksSize){

      ranksByLevel[_level].push(_player);

    }

    return true;

  }

  function updateRanks(address _player) public returns(bool) {

    require(hasRole(EXECUTOR_ROLE, msg.sender), "GoldenAnanasRank: Sender must have executor role");
    uint256 score = goldenAnanasScore.getScore(_player);
    uint256 size = ranks.length;

    if(ranks.length == 0){

      ranks.push(_player);

      return true;

    }

    if(ranks.length == 1 && ranks[0] == _player){

      return true;

    }

    for (uint i = 0; i < size; i++) {

      if(ranks[i] == _player){

        if(i != ranks.length -1){

          for (uint j = i; j < ranks.length -1; j++){

            ranks[j] = ranks[j + 1];

          }

        }

        ranks.pop();
        size--;

      }

    }

    for (uint i = 0; i < size; i++) {

      if(goldenAnanasScore.getScore(ranks[i]) < score){

        if(ranks.length < ranksSize){

          ranks.push(address(0) );

        }

        for(uint j = ranks.length -1; j > i; j--){

          ranks[j] = ranks[j -1];

        }

        ranks[i] = _player;
        return true;

      }

    }

    if(ranks.length <= ranksSize){

      ranks.push(_player);

    }

    return true;

  }

  function getRanks() public view returns (address[] memory, uint256[] memory){

    uint256 size = min(ranksSize, ranks.length);
    address[] memory players = new address[](size);
    uint256[] memory scores = new uint256[](size);

    for (uint i = 0; i < size; i++) {

      players[i] = ranks[i];
      scores[i] = goldenAnanasScore.getScore(players[i]);

    }

    return (players, scores);

  }

  function getRanksByLevel(uint256 _level) public view returns (address[] memory, uint256[] memory){

    uint256 size = min(ranksSize, ranksByLevel[_level].length);
    address[] memory players = new address[](size);
    uint256[] memory scores = new uint256[](size);

    for (uint i = 0; i < size; i++) {

      players[i] = ranksByLevel[_level][i];
      scores[i] = goldenAnanasScore.getScoreByLevel(_level, players[i]);

    }

    return (players, scores);

  }


  function min(uint256 a, uint256 b) internal pure returns (uint256) {
    return a < b ? a : b;
  }

}
