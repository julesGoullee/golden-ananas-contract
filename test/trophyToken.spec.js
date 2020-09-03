const TrophyToken = artifacts.require('TrophyToken');

contract('TrophyToken', (accounts) => {

  beforeEach( async () => {

    this.countLevels = 2;
    this.scoreBase = 100000;
    this.trophyTokenInstance = await TrophyToken.new('Goldananas', 'GANA', { from: accounts[0] });

  });

  it('Should mint', async () => {

    await this.trophyTokenInstance.mint(accounts[1], 1, { from: accounts[0] });
    const ownerOf = await this.trophyTokenInstance.ownerOf(1);
    assert.equal(ownerOf, accounts[1], 'owner invalid');

  });

});
