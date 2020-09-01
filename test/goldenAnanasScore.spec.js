const testUtils =require('./utils');
const GoldenAnanasScore = artifacts.require('GoldenAnanasScore');

contract('GoldenAnanasScore', (accounts) => {

  beforeEach( async () => {

    this.countLevels = 2;
    this.scoreBase = 100000;
    this.goldenAnanasScoreInstance = await GoldenAnanasScore.new(this.countLevels, this.scoreBase, { from: accounts[0] });

  });

  it('Should add level', async () => {

    const level = await this.goldenAnanasScoreInstance.countLevels();
    assert.equal(level.toNumber(), this.countLevels, 'count levels invalid');
    await this.goldenAnanasScoreInstance.addLevel({ from: accounts[0] });
    const levelUpdated = await this.goldenAnanasScoreInstance.countLevels();
    assert.equal(levelUpdated.toNumber(), this.countLevels + 1, 'count levels updated invalid');
    await testUtils.assertRevert(this.goldenAnanasScoreInstance.addLevel({ from: accounts[1] }), 'revert AdminRole');

  });

  it('Should set score throw when invalid params', async () => {

    await testUtils.assertRevert(this.goldenAnanasScoreInstance.setScore(0, 0, accounts[1], { from: accounts[0] }), 'revert invalid_score');
    await testUtils.assertRevert(this.goldenAnanasScoreInstance.setScore(0, this.scoreBase + 10, accounts[1], { from: accounts[0] }), 'revert invalid_score');
    await testUtils.assertRevert(this.goldenAnanasScoreInstance.setScore(2, 1, accounts[1], { from: accounts[0] }), 'revert invalid_level');

  });

  it('Should set and get score', async () => {

    const scoreLevel1 = 123;
    await this.goldenAnanasScoreInstance.setScore(0, scoreLevel1, accounts[1], { from: accounts[0] });

    const scoreByLevel = await this.goldenAnanasScoreInstance.getScoreByLevel(0, accounts[1]);
    assert.equal(scoreByLevel.toNumber(), scoreLevel1, 'invalid score by level');

    const score = await this.goldenAnanasScoreInstance.getScore(accounts[1]);
    assert.equal(this.scoreBase - score.toNumber(), scoreLevel1, 'invalid score');

  });

  it('Should set and get score updated', async () => {

    const scoreLevel1 = 123;
    const scoreLevelUpdated = 12;
    await this.goldenAnanasScoreInstance.setScore(0, scoreLevel1, accounts[1], { from: accounts[0] });
    await this.goldenAnanasScoreInstance.setScore(0, scoreLevelUpdated, accounts[1], { from: accounts[0] });

    const scoreByLevel = await this.goldenAnanasScoreInstance.getScoreByLevel(0, accounts[1]);
    assert.equal(scoreByLevel.toNumber(), scoreLevelUpdated, 'invalid score by level');

    const score = await this.goldenAnanasScoreInstance.getScore(accounts[1]);
    assert.equal(this.scoreBase - score.toNumber(), scoreLevelUpdated, 'invalid score');

  });

  it('Should set and get score many level', async () => {

    const scoreLevel1 = 123;
    const scoreLevel2 = 234;
    await this.goldenAnanasScoreInstance.setScore(0, scoreLevel1, accounts[1], { from: accounts[0] });
    await this.goldenAnanasScoreInstance.setScore(1, scoreLevel2, accounts[1], { from: accounts[0] });

    const score = await this.goldenAnanasScoreInstance.getScore(accounts[1]);
    assert.equal(score.toNumber(), this.scoreBase - scoreLevel1 + this.scoreBase - scoreLevel2, 'invalid score');

  });

  it('Should set and get score many level and update score', async () => {

    const scoreLevel1 = 345;
    const scoreLevel1Updated = 123;
    const scoreLevel2 = 234;
    await this.goldenAnanasScoreInstance.setScore(0, scoreLevel1, accounts[1], { from: accounts[0] });
    await this.goldenAnanasScoreInstance.setScore(1, scoreLevel2, accounts[1], { from: accounts[0] });
    await this.goldenAnanasScoreInstance.setScore(0, scoreLevel1Updated, accounts[1], { from: accounts[0] });

    const scoreByLevel = await this.goldenAnanasScoreInstance.getScoreByLevel(0, accounts[1]);
    assert.equal(scoreByLevel.toNumber(), scoreLevel1Updated, 'invalid score by level');

    const score = await this.goldenAnanasScoreInstance.getScore(accounts[1]);
    assert.equal(score.toNumber(), this.scoreBase - scoreLevel1Updated + this.scoreBase - scoreLevel2, 'invalid score');

  });

});
