const Ethers = require('ethers');
const testUtils =require('./utils');
const GoldenAnanasScore = artifacts.require('GoldenAnanasScore');
const GoldenAnanasRank = artifacts.require('GoldenAnanasRank');
const TrophyToken = artifacts.require('TrophyToken');
const GoldenAnanas = artifacts.require('GoldenAnanas');

contract('GoldenAnanas', (accounts) => {

  beforeEach( async () => {

    this.countLevels = 2;
    this.scoreBase = 100000;
    this.goldenAnanasScoreInstance = await GoldenAnanasScore.new(
      this.countLevels,
      this.scoreBase,
      { from: accounts[0] }
    );

    this.ranksSize = 3;
    this.goldenAnanasRankInstance = await GoldenAnanasRank.new(
      this.goldenAnanasScoreInstance.address,
      this.ranksSize,
      { from: accounts[0] }
    );
    this.trophyTokenInstance = await TrophyToken.new('Goldananas', 'GANA', { from: accounts[0] });

    this.minContrib = Ethers.utils.parseEther('0.05');
    this.ranksSize = 3;
    this.goldenAnanasInstance = await GoldenAnanas.new(
      this.goldenAnanasScoreInstance.address,
      this.goldenAnanasRankInstance.address,
      this.trophyTokenInstance.address,
      this.minContrib,
      { from: accounts[0] }
    );
    await this.goldenAnanasScoreInstance.grantRole(Ethers.utils.solidityKeccak256(['string'],['EXECUTOR_ROLE']), this.goldenAnanasInstance.address, { from: accounts[0] });
    await this.goldenAnanasRankInstance.grantRole(Ethers.utils.solidityKeccak256(['string'],['EXECUTOR_ROLE']), this.goldenAnanasInstance.address, { from: accounts[0] });
    await this.trophyTokenInstance.grantRole('0x0', this.goldenAnanasInstance.address, { from: accounts[0] });

  });

  it('Should set minContrib', async () => {

    const minContrib = await this.goldenAnanasInstance.minContrib();
    assert.equal(minContrib.toString(), this.minContrib.toString(), 'min contrib invalid');

    const minContribUpdated = Ethers.utils.parseEther('0.01');
    await this.goldenAnanasInstance.setMinContrib(minContribUpdated, { from: accounts[0] });
    const minContribUpdatedVal = await this.goldenAnanasInstance.minContrib();
    assert.equal(minContribUpdatedVal.toString(), minContribUpdated.toString(), 'min contrib updated invalid');

    await testUtils.assertRevert(this.goldenAnanasInstance.setMinContrib(minContrib, { from: accounts[1] }), 'revert GoldenAnanas: Sender must have admin role');

  });

  it('Should set score contract', async () => {

    assert(await this.goldenAnanasInstance.goldenAnanasScore(), this.goldenAnanasScoreInstance.address, 'contract score address invalid');

    await this.goldenAnanasInstance.setGoldenAnanasScore(accounts[9], { from: accounts[0] });
    assert(await this.goldenAnanasInstance.goldenAnanasScore(), accounts[9], 'contract score address updated invalid');

  });

  it('Should set rank contract', async () => {

    assert(await this.goldenAnanasInstance.goldenAnanasRank(), this.goldenAnanasRankInstance.address, 'contract rank address invalid');

    await this.goldenAnanasInstance.setGoldenAnanasRank(accounts[9], { from: accounts[0] });
    assert(await this.goldenAnanasInstance.goldenAnanasRank(), accounts[9], 'contract rank address updated invalid');

  });

  it('Should set score and get score', async () => {

    const score = await this.goldenAnanasInstance.getScore({ from: accounts[1] });
    assert.equal(score.toNumber(), 0, 'score updated invalid');
    const scoreByLevel = await this.goldenAnanasInstance.getScoreByLevel(0, { from: accounts[1] });
    assert.equal(scoreByLevel.toNumber(), 0, 'ranks updated invalid');

    await this.goldenAnanasInstance.setScore(0, 123, { from: accounts[1], value: 0 });

    const scoreUpdated = await this.goldenAnanasInstance.getScore({ from: accounts[1] });
    assert.equal(scoreUpdated.toNumber(), this.scoreBase - 123, 'score updated invalid');
    const scoreByLevelUpdated = await this.goldenAnanasInstance.getScoreByLevel(0, { from: accounts[1] });
    assert.equal(scoreByLevelUpdated.toNumber(), 123, 'score updated invalid');

  });

  it('Should set score and get ranks', async () => {

    const ranks = await this.goldenAnanasInstance.getRanks();
    assert.equal(ranks[0].length, 0, 'ranks invalid');
    assert.equal(ranks[1].length, 0, 'ranks invalid');
    const ranksLevel = await this.goldenAnanasInstance.getRanksByLevel(0);
    assert.equal(ranksLevel[0].length, 0, 'ranks level invalid');
    assert.equal(ranksLevel[1].length, 0, 'ranks level invalid');

    await this.goldenAnanasInstance.setScore(0, 123, { from: accounts[1], value: 0 });

    const ranksUpdated = await this.goldenAnanasInstance.getRanks();
    assert.equal(ranksUpdated[0][0], accounts[1], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][0].toNumber(), this.scoreBase - 123, 'ranks updated invalid');
    const ranksLevelUpdated = await this.goldenAnanasInstance.getRanksByLevel(0);
    assert.equal(ranksLevelUpdated[0][0], accounts[1], 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[1][0].toNumber(), 123, 'ranks level updated invalid');

  });

  it('Should setScore throw if contribution too low', async () => {

    await this.goldenAnanasInstance.setScore(0, 123, { from: accounts[1], value: 0 });
    await testUtils.assertRevert(this.goldenAnanasInstance.setScore(1, 1, { from: accounts[1], value: 0 }), 'revert contribution_too_low');

  });

  it('Should setScore throw if previous level not complete', async () => {

    await testUtils.assertRevert(this.goldenAnanasInstance.setScore(1, 1, { from: accounts[1], value: this.minContrib.toString() }), 'revert invalid_player_data');

  });

  it('Should setScore throw if previous level have the lowest time score', async () => {

    await this.goldenAnanasInstance.setScore(0, 123, { from: accounts[1], value: 0 });
    await this.goldenAnanasInstance.setScore(1, 12, { from: accounts[1], value: this.minContrib.toString() });
    await testUtils.assertRevert(this.goldenAnanasInstance.setScore(1, 123, { from: accounts[1], value: this.minContrib.toString() }), 'revert score_lower');

  });

  it('Should admin setScore for other', async () => {

    await this.goldenAnanasInstance.setScore(0, 123, { from: accounts[1], value: 0 });
    await this.goldenAnanasInstance.setScoreFor(0, 12, accounts[1], { from: accounts[0], value: 0 });

    const ranksUpdated = await this.goldenAnanasInstance.getRanks();
    assert.equal(ranksUpdated[0][0], accounts[1], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][0].toNumber(), this.scoreBase - 12, 'ranks updated invalid');
    const ranksLevelUpdated = await this.goldenAnanasInstance.getRanksByLevel(0);
    assert.equal(ranksLevelUpdated[0][0], accounts[1], 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[1][0].toNumber(), 12, 'ranks level updated invalid');

  });

});
