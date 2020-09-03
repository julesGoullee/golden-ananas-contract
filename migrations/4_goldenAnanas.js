const GoldenAnanasScore = artifacts.require('GoldenAnanasScore');
const GoldenAnanasRank = artifacts.require('GoldenAnanasRank');
const GoldenAnanas = artifacts.require('GoldenAnanas');
const TrophyToken = artifacts.require('TrophyToken');
const Ethers = require('ethers');

const Config = require('../config');

module.exports = async function(deployer) {

  const goldenAnanasScoreInstance = await GoldenAnanasScore.deployed();
  const goldenAnanasRankInstance = await GoldenAnanasRank.deployed();
  const trophyTokenInstance = await TrophyToken.deployed();

  await deployer.deploy(
    GoldenAnanas,
    GoldenAnanasScore.address,
    GoldenAnanasRank.address,
    trophyTokenInstance.address,
    Ethers.utils.parseEther(Config.minContribution)
  );

  await goldenAnanasScoreInstance.grantRole(Ethers.utils.solidityKeccak256(['string'],['EXECUTOR_ROLE']), GoldenAnanas.address);
  await goldenAnanasRankInstance.grantRole(Ethers.utils.solidityKeccak256(['string'],['EXECUTOR_ROLE']), GoldenAnanas.address);
  await trophyTokenInstance.grantRole('0x0', GoldenAnanas.address);

};
