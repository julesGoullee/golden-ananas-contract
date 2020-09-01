const GoldenAnanasScore = artifacts.require('GoldenAnanasScore');
const GoldenAnanasRank = artifacts.require('GoldenAnanasRank');

const Config = require('../config');

module.exports = async function(deployer) {

  await deployer.deploy(
    GoldenAnanasRank,
    GoldenAnanasScore.address,
    Config.ranksSize
  );

};
