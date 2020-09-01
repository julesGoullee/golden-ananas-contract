// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import "./openzeppelin/SafeMath.sol";
import "./openzeppelin/IERC20.sol";
import "./Executor.sol";
import "./AdminRole.sol";

contract GoldenAnanasScore is ExecutorRole, AdminRole {

  using SafeMath for uint;

  mapping(uint256 => mapping(address => uint256) ) public scoreByLevel;
  mapping(address => uint256) public score;
  uint256 public scoreBase;

  uint256 public countLevels;

  constructor(
    uint256 _countLevels,
    uint256 _scoreBase
  ) public {

    countLevels = _countLevels;
    scoreBase = _scoreBase;

  }

  function addLevel() public onlyAdmin returns(bool){

    countLevels = countLevels.add(1);

    return true;

  }

  function setScore(uint256 _level, uint256 _score, address _player) public onlyExecutor {

    require(_score != 0 && _score < scoreBase, "invalid_score");
    require(_level < countLevels, "invalid_level");

    if(scoreByLevel[_level][_player] != 0){

      score[_player] = score[_player].sub(scoreBase.sub(scoreByLevel[_level][_player]) );

    }

    score[_player] = score[_player].add(scoreBase.sub(_score) );
    scoreByLevel[_level][_player] = _score;

  }

  function getScoreByLevel(uint256 _level, address _player) public view returns (uint256){

    return scoreByLevel[_level][_player];

  }

  function getScore(address _player) public view returns (uint256){

    return score[_player];

  }

}
