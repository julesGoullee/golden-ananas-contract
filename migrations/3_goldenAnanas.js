const GoldenAnanasScore = artifacts.require('GoldenAnanasScore');
const GoldenAnanasRank = artifacts.require('GoldenAnanasRank');
const GoldenAnanas = artifacts.require('GoldenAnanas');
const Ethers = require('ethers');

const Config = require('../config');

module.exports = async function(deployer) {

  const goldenAnanasScoreInstance = await GoldenAnanasScore.deployed();
  const goldenAnanasRankInstance = await GoldenAnanasRank.deployed();

  await deployer.deploy(
    GoldenAnanas,
    GoldenAnanasScore.address,
    GoldenAnanasRank.address,
    Ethers.utils.parseEther(Config.minContribution)
  );
  await goldenAnanasScoreInstance.addExecutor(GoldenAnanas.address);
  await goldenAnanasRankInstance.addExecutor(GoldenAnanas.address);

};
