const GoldenAnanasScore = artifacts.require('GoldenAnanasScore');
const GoldenAnanasRank = artifacts.require('GoldenAnanasRank');

contract('GoldenAnanasRank', (accounts) => {

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

  });

  it('Should set score contract', async () => {

    assert(await this.goldenAnanasRankInstance.goldenAnanasScore(), this.goldenAnanasScoreInstance.address, 'contract score address invalid');

    await this.goldenAnanasRankInstance.setGoldenAnanasScore(accounts[9], { from: accounts[0] });
    assert(await this.goldenAnanasRankInstance.goldenAnanasScore(), accounts[9], 'contract score address updated invalid');

  });

  it('Should update all ranks', async () => {

    const ranksEmpty = await this.goldenAnanasRankInstance.getRanks();
    assert.equal(ranksEmpty[0].length, 0, 'ranks empty invalid');

    await this.goldenAnanasScoreInstance.setScore(0, 123, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[1], { from: accounts[0], value: 0 });

    const ranks = await this.goldenAnanasRankInstance.getRanks();
    assert.equal(ranks[0].length, 1, 'ranks invalid');
    assert.equal(ranks[0][0], accounts[1], 'ranks invalid');
    assert.equal(ranks[1][0].toNumber(), this.scoreBase - 123, 'ranks invalid');
    const ranksLevel = await this.goldenAnanasRankInstance.getRanksByLevel(0);
    assert.equal(ranksLevel[0].length, 1, 'ranks invalid');
    assert.equal(ranksLevel[0][0], accounts[1], 'ranks level invalid');
    assert.equal(ranksLevel[1][0].toNumber(), 123, 'ranks level invalid');

  });

  it('Should update ranks separated', async () => {

    await this.goldenAnanasScoreInstance.setScore(0, 123, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateRanks( accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateRanksByLevel(0, accounts[1], { from: accounts[0], value: 0 });

    const ranks = await this.goldenAnanasRankInstance.getRanks();
    assert.equal(ranks[0].length, 1, 'ranks invalid');
    assert.equal(ranks[0][0], accounts[1], 'ranks invalid');
    assert.equal(ranks[1][0].toNumber(), this.scoreBase - 123, 'ranks invalid');
    const ranksLevel = await this.goldenAnanasRankInstance.getRanksByLevel(0);
    assert.equal(ranksLevel[0].length, 1, 'ranks invalid');
    assert.equal(ranksLevel[0][0], accounts[1], 'ranks level invalid');
    assert.equal(ranksLevel[1][0].toNumber(), 123, 'ranks level invalid');

  });

  it('Should update ranks many time', async () => {

    await this.goldenAnanasScoreInstance.setScore(0, 123, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[1], { from: accounts[0], value: 0 });

    const ranks = await this.goldenAnanasRankInstance.getRanks();
    assert.equal(ranks[0].length, 1, 'ranks invalid');
    assert.equal(ranks[0][0], accounts[1], 'ranks invalid');
    assert.equal(ranks[1][0].toNumber(), this.scoreBase - 123, 'ranks invalid');
    const ranksLevel = await this.goldenAnanasRankInstance.getRanksByLevel(0);
    assert.equal(ranksLevel[0].length, 1, 'ranks invalid');
    assert.equal(ranksLevel[0][0], accounts[1], 'ranks level invalid');
    assert.equal(ranksLevel[1][0].toNumber(), 123, 'ranks level invalid');

    await this.goldenAnanasScoreInstance.setScore(0, 12, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[1], { from: accounts[0], value: 0 });

    const ranksUpdated = await this.goldenAnanasRankInstance.getRanks();
    assert.equal(ranksUpdated[0].length, 1, 'ranks updated invalid');
    assert.equal(ranksUpdated[0][0], accounts[1], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][0].toNumber(), this.scoreBase - 12, 'ranks updated invalid');
    const ranksLevelUpdated = await this.goldenAnanasRankInstance.getRanksByLevel(0);
    assert.equal(ranksLevelUpdated[0].length, 1, 'ranks updated invalid');
    assert.equal(ranksLevelUpdated[0][0], accounts[1], 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[1][0].toNumber(), 12, 'ranks level updated invalid');

  });

  it('Should update ranks many players', async () => {

    await this.goldenAnanasScoreInstance.setScore(0, 12345, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(0, 1234, accounts[2], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[2], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(0, 123, accounts[3], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[3], { from: accounts[0], value: 0 });

    const ranksUpdated = await this.goldenAnanasRankInstance.getRanks();
    assert.equal(ranksUpdated[0].length, 3, 'ranks updated invalid');
    assert.equal(ranksUpdated[0][0], accounts[3], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][0].toNumber(), this.scoreBase - 123, 'ranks updated invalid');
    assert.equal(ranksUpdated[0][1], accounts[2], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][1].toNumber(), this.scoreBase - 1234, 'ranks updated invalid');
    assert.equal(ranksUpdated[0][2], accounts[1], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][2].toNumber(), this.scoreBase - 12345, 'ranks updated invalid');
    const ranksLevelUpdated = await this.goldenAnanasRankInstance.getRanksByLevel(0);
    assert.equal(ranksLevelUpdated[0].length, 3, 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[0][0], accounts[3], 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[1][0].toNumber(), 123, 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[0][1], accounts[2], 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[1][1].toNumber(), 1234, 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[0][2], accounts[1], 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[1][2].toNumber(), 12345, 'ranks level updated invalid');

  });

  it('Should update ranks many player with update score', async () => {

    await this.goldenAnanasScoreInstance.setScore(0, 12345, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(0, 123, accounts[2], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[2], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(0, 1234, accounts[3], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[3], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(0, 12, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[1], { from: accounts[0], value: 0 });

    const ranksUpdated = await this.goldenAnanasRankInstance.getRanks();
    assert.equal(ranksUpdated[0].length, 3, 'ranks updated invalid');
    assert.equal(ranksUpdated[0][0], accounts[1], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][0].toNumber(), this.scoreBase - 12, 'ranks updated invalid');
    assert.equal(ranksUpdated[0][1], accounts[2], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][1].toNumber(), this.scoreBase - 123, 'ranks updated invalid');
    assert.equal(ranksUpdated[0][2], accounts[3], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][2].toNumber(), this.scoreBase - 1234, 'ranks updated invalid');

    const ranksLevelUpdated = await this.goldenAnanasRankInstance.getRanksByLevel(0);
    assert.equal(ranksLevelUpdated[0].length, 3, 'ranks updated invalid');
    assert.equal(ranksLevelUpdated[0][0], accounts[1], 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[1][0].toNumber(), 12, 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[0][1], accounts[2], 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[1][1].toNumber(), 123, 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[0][2], accounts[3], 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[1][2].toNumber(), 1234, 'ranks level updated invalid');

  });

  it('Should update ranks more players than rank size', async () => {

    await this.goldenAnanasScoreInstance.setScore(0, 456, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(0, 12, accounts[2], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[2], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(0, 234, accounts[3], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[3], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(0, 123, accounts[4], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[4], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(0, 345, accounts[5], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[5], { from: accounts[0], value: 0 });

    const ranksUpdated = await this.goldenAnanasRankInstance.getRanks();
    assert.equal(ranksUpdated[0].length, 3, 'ranks updated invalid');
    assert.equal(ranksUpdated[0][0], accounts[2], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][0].toNumber(), this.scoreBase - 12, 'ranks updated invalid');
    assert.equal(ranksUpdated[0][1], accounts[4], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][1].toNumber(), this.scoreBase - 123, 'ranks updated invalid');
    assert.equal(ranksUpdated[0][2], accounts[3], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][2].toNumber(), this.scoreBase - 234, 'ranks updated invalid');
    const ranksLevelUpdated = await this.goldenAnanasRankInstance.getRanksByLevel(0);
    assert.equal(ranksLevelUpdated[0].length, 3, 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[0][0], accounts[2], 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[1][0].toNumber(), 12, 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[0][1], accounts[4], 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[1][1].toNumber(), 123, 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[0][2], accounts[3], 'ranks level updated invalid');
    assert.equal(ranksLevelUpdated[1][2].toNumber(), 234, 'ranks level updated invalid');

  });

  it('Should update ranks many level', async () => {

    const scoreLevel1 = 123;
    const scoreLevel2 = 321;
    await this.goldenAnanasScoreInstance.setScore(0, scoreLevel1, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(1, scoreLevel2, accounts[1], { from: accounts[0], value: this.minContrib });
    await this.goldenAnanasRankInstance.updateAllRanks(1, accounts[1], { from: accounts[0], value: 0 });

    const ranks = await this.goldenAnanasRankInstance.getRanks();
    assert.equal(ranks[0].length, 1, 'ranks level invalid');
    assert.equal(ranks[0][0], accounts[1], 'ranks invalid');
    assert.equal(ranks[1][0].toNumber(), this.scoreBase - scoreLevel1 + this.scoreBase - scoreLevel2, 'ranks invalid');

    const ranksLevel1 = await this.goldenAnanasRankInstance.getRanksByLevel(0);
    assert.equal(ranksLevel1[0].length, 1, 'ranks level invalid');
    assert.equal(ranksLevel1[0][0], accounts[1], 'ranks level invalid');
    assert.equal(ranksLevel1[1][0].toNumber(), 123, 'ranks level invalid');

    const ranksLevel2 = await this.goldenAnanasRankInstance.getRanksByLevel(1);
    assert.equal(ranksLevel2[0].length, 1, 'ranks level invalid');
    assert.equal(ranksLevel2[0][0], accounts[1], 'ranks level invalid');
    assert.equal(ranksLevel2[1][0].toNumber(), 321, 'ranks level invalid');

  });

  it('Should update ranks many level with update score', async () => {

    const scoreLevel1 = 234;
    const scoreLevel2 = 321;
    const scoreLevelUpdated = 123;

    await this.goldenAnanasScoreInstance.setScore(0, scoreLevel1, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(1, scoreLevel2, accounts[1], { from: accounts[0], value: this.minContrib });
    await this.goldenAnanasRankInstance.updateAllRanks(1, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(0, scoreLevelUpdated, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[1], { from: accounts[0], value: 0 });

    const ranks = await this.goldenAnanasRankInstance.getRanks();
    assert.equal(ranks[0].length, 1, 'ranks level invalid');
    assert.equal(ranks[0][0], accounts[1], 'ranks invalid');
    assert.equal(ranks[1][0].toNumber(), this.scoreBase - scoreLevelUpdated + this.scoreBase - scoreLevel2, 'ranks invalid');

    const ranksLevel1 = await this.goldenAnanasRankInstance.getRanksByLevel(0);
    assert.equal(ranksLevel1[0].length, 1, 'ranks level invalid');
    assert.equal(ranksLevel1[0][0], accounts[1], 'ranks level invalid');
    assert.equal(ranksLevel1[1][0].toNumber(), scoreLevelUpdated, 'ranks level invalid');

    const ranksLevel2 = await this.goldenAnanasRankInstance.getRanksByLevel(1);
    assert.equal(ranksLevel2[0].length, 1, 'ranks level invalid');
    assert.equal(ranksLevel2[0][0], accounts[1], 'ranks level invalid');
    assert.equal(ranksLevel2[1][0].toNumber(), scoreLevel2, 'ranks level invalid');

  });

  it('Should update ranks many player many level with update score level by level', async () => {

    await this.goldenAnanasScoreInstance.setScore(0, 456, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(0, 234, accounts[2], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[2], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(0, 123, accounts[3], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[3], { from: accounts[0], value: 0 });

    await this.goldenAnanasScoreInstance.setScore(1, 123, accounts[1], { from: accounts[0], value: this.minContrib });
    await this.goldenAnanasRankInstance.updateAllRanks(1, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(1, 13, accounts[2], { from: accounts[0], value: this.minContrib });
    await this.goldenAnanasRankInstance.updateAllRanks(1, accounts[2], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(1, 234, accounts[3], { from: accounts[0], value: this.minContrib });
    await this.goldenAnanasRankInstance.updateAllRanks(1, accounts[3], { from: accounts[0], value: 0 });

    const ranksUpdated = await this.goldenAnanasRankInstance.getRanks();
    assert.equal(ranksUpdated[0].length, 3, 'ranks level invalid');
    assert.equal(ranksUpdated[0][0], accounts[2], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][0].toNumber(), this.scoreBase - 234 + this.scoreBase - 13, 'ranks updated invalid');
    assert.equal(ranksUpdated[0][1], accounts[3], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][1].toNumber(), this.scoreBase - 123 + this.scoreBase - 234, 'ranks updated invalid');
    assert.equal(ranksUpdated[0][2], accounts[1], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][2].toNumber(), this.scoreBase - 456 + this.scoreBase - 123, 'ranks updated invalid');

    const ranksLevel1Updated = await this.goldenAnanasRankInstance.getRanksByLevel(0);
    assert.equal(ranksLevel1Updated[0].length, 3, 'ranks level invalid');
    assert.equal(ranksLevel1Updated[0][0], accounts[3], 'ranks level updated invalid');
    assert.equal(ranksLevel1Updated[1][0].toNumber(), 123, 'ranks level updated invalid');
    assert.equal(ranksLevel1Updated[0][1], accounts[2], 'ranks level updated invalid');
    assert.equal(ranksLevel1Updated[1][1].toNumber(), 234, 'ranks level updated invalid');
    assert.equal(ranksLevel1Updated[0][2], accounts[1], 'ranks level updated invalid');
    assert.equal(ranksLevel1Updated[1][2].toNumber(), 456, 'ranks level updated invalid');

    const ranksLevel2Updated = await this.goldenAnanasRankInstance.getRanksByLevel(1);
    assert.equal(ranksLevel2Updated[0].length, 3, 'ranks level invalid');
    assert.equal(ranksLevel2Updated[0][0], accounts[2], 'ranks level updated invalid');
    assert.equal(ranksLevel2Updated[1][0].toNumber(), 13, 'ranks level updated invalid');
    assert.equal(ranksLevel2Updated[0][1], accounts[1], 'ranks level updated invalid');
    assert.equal(ranksLevel2Updated[1][1].toNumber(), 123, 'ranks level updated invalid');
    assert.equal(ranksLevel2Updated[0][2], accounts[3], 'ranks level updated invalid');
    assert.equal(ranksLevel2Updated[1][2].toNumber(), 234, 'ranks level updated invalid');

  });

  it('Should update ranks many player many level with update score player by player change rank', async () => {

    await this.goldenAnanasScoreInstance.setScore(0, 456, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(1, 123, accounts[1], { from: accounts[0], value: this.minContrib });
    await this.goldenAnanasRankInstance.updateAllRanks(1, accounts[1], { from: accounts[0], value: 0 });

    await this.goldenAnanasScoreInstance.setScore(0, 234, accounts[2], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[2], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(1, 13, accounts[2], { from: accounts[0], value: this.minContrib });
    await this.goldenAnanasRankInstance.updateAllRanks(1, accounts[2], { from: accounts[0], value: 0 });

    await this.goldenAnanasScoreInstance.setScore(0, 123, accounts[3], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[3], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(1, 234, accounts[3], { from: accounts[0], value: this.minContrib });
    await this.goldenAnanasRankInstance.updateAllRanks(1, accounts[3], { from: accounts[0], value: 0 });

    const ranksUpdated = await this.goldenAnanasRankInstance.getRanks();
    assert.equal(ranksUpdated[0].length, 3, 'ranks level invalid');
    assert.equal(ranksUpdated[0][0], accounts[2], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][0].toNumber(), this.scoreBase - 234 + this.scoreBase - 13, 'ranks updated invalid');
    assert.equal(ranksUpdated[0][1], accounts[3], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][1].toNumber(), this.scoreBase - 123 + this.scoreBase - 234, 'ranks updated invalid');
    assert.equal(ranksUpdated[0][2], accounts[1], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][2].toNumber(), this.scoreBase - 456 + this.scoreBase - 123, 'ranks updated invalid');

    const ranksLevel1Updated = await this.goldenAnanasRankInstance.getRanksByLevel(0);
    assert.equal(ranksLevel1Updated[0].length, 3, 'ranks level invalid');
    assert.equal(ranksLevel1Updated[0][0], accounts[3], 'ranks level updated invalid');
    assert.equal(ranksLevel1Updated[1][0].toNumber(), 123, 'ranks level updated invalid');
    assert.equal(ranksLevel1Updated[0][1], accounts[2], 'ranks level updated invalid');
    assert.equal(ranksLevel1Updated[1][1].toNumber(), 234, 'ranks level updated invalid');
    assert.equal(ranksLevel1Updated[0][2], accounts[1], 'ranks level updated invalid');
    assert.equal(ranksLevel1Updated[1][2].toNumber(), 456, 'ranks level updated invalid');

    const ranksLevel2Updated = await this.goldenAnanasRankInstance.getRanksByLevel(1);
    assert.equal(ranksLevel2Updated[0].length, 3, 'ranks level invalid');
    assert.equal(ranksLevel2Updated[0][0], accounts[2], 'ranks level updated invalid');
    assert.equal(ranksLevel2Updated[1][0].toNumber(), 13, 'ranks level updated invalid');
    assert.equal(ranksLevel2Updated[0][1], accounts[1], 'ranks level updated invalid');
    assert.equal(ranksLevel2Updated[1][1].toNumber(), 123, 'ranks level updated invalid');
    assert.equal(ranksLevel2Updated[0][2], accounts[3], 'ranks level updated invalid');
    assert.equal(ranksLevel2Updated[1][2].toNumber(), 234, 'ranks level updated invalid');

  });

  it('Should update ranks many player many level with update score player by player no change rank', async () => {

    await this.goldenAnanasScoreInstance.setScore(0, 123, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[1], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(1, 256, accounts[1], { from: accounts[0], value: this.minContrib });
    await this.goldenAnanasRankInstance.updateAllRanks(1, accounts[1], { from: accounts[0], value: 0 });

    await this.goldenAnanasScoreInstance.setScore(0, 120, accounts[2], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[2], { from: accounts[0], value: 0 });
    await this.goldenAnanasScoreInstance.setScore(1, 257, accounts[2], { from: accounts[0], value: this.minContrib });
    await this.goldenAnanasRankInstance.updateAllRanks(1, accounts[2], { from: accounts[0], value: 0 });

    await this.goldenAnanasScoreInstance.setScore(0, 114, accounts[2], { from: accounts[0], value: 0 });
    await this.goldenAnanasRankInstance.updateAllRanks(0, accounts[2], { from: accounts[0], value: 0 });

    const ranksUpdated = await this.goldenAnanasRankInstance.getRanks();
    assert.equal(ranksUpdated[0].length, 2, 'ranks level invalid');
    assert.equal(ranksUpdated[0][0], accounts[2], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][0].toNumber(), this.scoreBase - 114 + this.scoreBase - 257, 'ranks updated invalid');
    assert.equal(ranksUpdated[0][1], accounts[1], 'ranks updated invalid');
    assert.equal(ranksUpdated[1][1].toNumber(), this.scoreBase - 123 + this.scoreBase - 256, 'ranks updated invalid');

    const ranksLevel1Updated = await this.goldenAnanasRankInstance.getRanksByLevel(0);
    assert.equal(ranksLevel1Updated[0].length, 2, 'ranks level invalid');
    assert.equal(ranksLevel1Updated[0][0], accounts[2], 'ranks level updated invalid');
    assert.equal(ranksLevel1Updated[1][0].toNumber(), 114, 'ranks level updated invalid');
    assert.equal(ranksLevel1Updated[0][1], accounts[1], 'ranks level updated invalid');
    assert.equal(ranksLevel1Updated[1][1].toNumber(), 123, 'ranks level updated invalid');

    const ranksLevel2Updated = await this.goldenAnanasRankInstance.getRanksByLevel(1);
    assert.equal(ranksLevel2Updated[0].length, 2, 'ranks level invalid');
    assert.equal(ranksLevel2Updated[0][0], accounts[1], 'ranks level updated invalid');
    assert.equal(ranksLevel2Updated[1][0].toNumber(), 256, 'ranks level updated invalid');
    assert.equal(ranksLevel2Updated[0][1], accounts[2], 'ranks level updated invalid');
    assert.equal(ranksLevel2Updated[1][1].toNumber(), 257, 'ranks level updated invalid');

  });

});
