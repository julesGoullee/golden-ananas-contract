const TrophyToken = artifacts.require('TrophyToken');

module.exports = async function(deployer) {

  await deployer.deploy(
    TrophyToken,
    'Golden ananas',
    'GANA',
  );

};
