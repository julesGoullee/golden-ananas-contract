require('dotenv').config();

const config = {
  infuraApiKey: process.env.INFURA_API_KEY,
  etherscanApiKey: process.env.ETHERSCAN_API_KEY,
  privateKey: process.env.PRIVATE_KEY,
  countLevels: parseInt(process.env.COUNT_LEVEL || 3, 10),
  scoreBase: parseInt(process.env.SCORE_BASE || 100000, 10),
  ranksSize: parseInt(process.env.TOP_RANK_SIZE || 10, 10),
};

module.exports = config;
