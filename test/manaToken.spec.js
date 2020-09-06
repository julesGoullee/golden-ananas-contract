const Ethers = require('ethers');
const ManaToken = artifacts.require('ManaToken');

contract('ManaToken', (accounts) => {

  beforeEach( async () => {

    this.manaTokenInstance = await ManaToken.new('Mana', 'MANA', Ethers.utils.parseEther('100'), { from: accounts[0] });

  });

  it('Should be minted', async () => {

    const totalSupply = await this.manaTokenInstance.balanceOf(accounts[0], { from: accounts[0] });
    assert.equal(totalSupply, Ethers.utils.parseEther('100').toString(), 'supply invalid');

  });

});
