const Ethers = require('ethers');
const ManaToken = artifacts.require('ManaToken');

module.exports = async function(deployer) {

  await deployer.deploy(
    ManaToken,
    'Mana',
    'MANA',
    Ethers.utils.parseEther('100000')
  );

};
