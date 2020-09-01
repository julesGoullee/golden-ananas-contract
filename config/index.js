require('dotenv').config();

const config = {
  infuraApiKey: process.env.INFURA_API_KEY,
  privateKey: process.env.PRIVATE_KEY,
  minContribution: process.env.MIN_CONTRIBUTION || '0.05', // in eth
  countLevels: parseInt(process.env.COUNT_LEVEL || 2, 10),
  scoreBase: parseInt(process.env.SCORE_BASE || 100000, 10),
  ranksSize: parseInt(process.env.TOP_RANK_SIZE || 10, 10),
};

module.exports = config;
