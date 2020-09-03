// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import "./openzeppelin/SafeMath.sol";
import "./openzeppelin/IERC20.sol";
import "./openzeppelin/AccessControl.sol";

import "./GoldenAnanasScore.sol";
import "./GoldenAnanasRank.sol";
import "./TrophyToken.sol";

contract GoldenAnanas is AccessControl {

  using SafeMath for uint;

  GoldenAnanasScore public goldenAnanasScore;
  GoldenAnanasRank public goldenAnanasRank;
  TrophyToken public trophyToken;
  uint256 public minContrib;

  constructor(
    GoldenAnanasScore _goldenAnanasScore,
    GoldenAnanasRank _goldenAnanasRank,
    TrophyToken _trophyToken,
    uint256 _minContrib
  ) public {

    goldenAnanasScore = _goldenAnanasScore;
    goldenAnanasRank = _goldenAnanasRank;
    trophyToken = _trophyToken;
    minContrib = _minContrib;
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

  }

  function setMinContrib(uint256 _minContrib) public {

    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "GoldenAnanas: Sender must have admin role");

    minContrib = _minContrib;

  }

  function setGoldenAnanasScore(GoldenAnanasScore _goldenAnanasScore) public {

    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "GoldenAnanas: Sender must have admin role");
    goldenAnanasScore = _goldenAnanasScore;

  }

  function setGoldenAnanasRank(GoldenAnanasRank _goldenAnanasRank) public {

    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "GoldenAnanas: Sender must have admin role");
    goldenAnanasRank = _goldenAnanasRank;

  }

  function setTrophyToken(TrophyToken _trophyToken) public {

    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "GoldenAnanas: Sender must have admin role");
    trophyToken = _trophyToken;

  }

  function _setScoreFor(uint256 _level, uint256 _scoreLevel, address _player) private {

    require(_level == 0 || goldenAnanasScore.scoreByLevel(_level -1, _player) != 0, "invalid_player_data");

    uint256 prevScore = goldenAnanasScore.getScoreByLevel(_level, _player);

    if(prevScore == 0){

      trophyToken.mint(_player, uint256(_player) + _level);

    } else {

      require(prevScore > _scoreLevel, "score_lower");

    }

    goldenAnanasScore.setScore(_level, _scoreLevel, _player);
    goldenAnanasRank.updateAllRanks(_level, _player);

  }

  function setScoreFor(uint256 _level, uint256 _scoreLevel, address _player) public {

    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "GoldenAnanas: Sender must have admin role");
    _setScoreFor(_level, _scoreLevel, _player);

  }

  function setScore(uint256 _level, uint256 _scoreLevel) public payable {

    if(_level == goldenAnanasScore.countLevels() - 1){

      require(msg.value >= minContrib, "contribution_too_low");

    }

    _setScoreFor(_level, _scoreLevel, msg.sender);

  }

  function getScore() public view returns (uint256){

    return goldenAnanasScore.getScore(msg.sender);

  }

  function getScoreByLevel(uint256 _level) public view returns (uint256){

    return goldenAnanasScore.getScoreByLevel(_level, msg.sender);

  }

  function getRanks() public view returns (address[] memory, uint256[] memory){

    return goldenAnanasRank.getRanks();

  }

  function getRanksByLevel(uint256 _level) public view returns (address[] memory, uint256[] memory){

    return goldenAnanasRank.getRanksByLevel(_level);

  }

  function withdrawToken(IERC20 _token, uint256 _value) public {

    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "GoldenAnanas: Sender must have admin role");
    _token.transferFrom(address(this), msg.sender, _value);

  }

  function withdrawEth(uint256 _value) public {

    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "GoldenAnanas: Sender must have admin role");
    msg.sender.transfer(_value);

  }

  fallback() external payable {}

  receive() external payable {}

}
