const GoldenAnanasScore = artifacts.require('GoldenAnanasScore');

const Config = require('../config');

module.exports = async function(deployer) {

  await deployer.deploy(
    GoldenAnanasScore,
    Config.countLevels,
    Config.scoreBase,
  );

};
