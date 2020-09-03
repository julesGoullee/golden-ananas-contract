const PrivateKeyProvider = require('./truffleProviders/privateKey');
const Ethers = require('ethers');

const Config = require('./config');

const pkProvider = network => {
  // return new PrivateKeyProvider(Config.privateKey, `https://cloudflare-eth.com`);
  return new PrivateKeyProvider(Config.privateKey, `https://${network}.infura.io/v3/${Config.infuraApiKey}`);
};

module.exports = {

  networks: {

    development: {
      host: '127.0.0.1',     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      gas: 5000000,
      gasPrice: Ethers.utils.parseUnits('2', 'gwei').toString(),
      network_id: '*',       // Any network (default: none)
      skipDryRun: true,
    },

    ropsten: {
      provider: () => pkProvider('ropsten'),
      network_id: '3',
      gas: 5000000,
      timeoutBlocks: 50000,
      networkCheckTimeout: 50000,
      gasPrice: Ethers.utils.parseUnits('10', 'gwei').toString(),
      skipDryRun: true
    },

    rinkeby: {
      provider: () => pkProvider('rinkeby'),
      network_id: '4',
      gas: 2000000,
      timeoutBlocks: 50000,
      networkCheckTimeout: 50000,
      gasPrice: Ethers.utils.parseUnits('2', 'gwei').toString(),
      skipDryRun: true
    },

    mainnet: {
      provider: () => pkProvider('mainnet'),
      network_id: '1',
      gas: 2000000,
      gasPrice: Ethers.utils.parseUnits(    '2.5', 'gwei').toString(),
      timeoutBlocks: 500000,
      networkCheckTimeout: 500000,
      skipDryRun: true,
      production: true,
    },

  },

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.6.12',
      // parser: 'solcjs',
      settings: {
        //https://solidity.readthedocs.io/en/v0.6.1/using-the-compiler.html#compiler-input-and-output-json-description
        optimizer: {
          enabled: true,
          runs: 200,
          details: {
            // The peephole optimizer is always on if no details are given,
            // use details to switch it off.
            peephole: true,
            // The unused jumpdest remover is always on if no details are given,
            // use details to switch it off.
            jumpdestRemover: true,
            // Sometimes re-orders literals in commutative operations.
            orderLiterals: true,
            // Removes duplicate code blocks
            deduplicate: true,
            // Common subexpression elimination, this is the most complicated step but
            // can also provide the largest gain.
            cse: true,
            // Optimize representation of literal numbers and strings in code.
            constantOptimizer: true,
            // The new Yul optimizer. Mostly operates on the code of ABIEncoderV2.
            // It can only be activated through the details here.
            yul: true,
            yulDetails: {
              // Improve allocation of stack slots for variables, can free up stack slots early.
              // Activated by default if the Yul optimizer is activated.
              stackAllocation: true
            }
          },
        },
        evmVersion: 'istanbul'
      }
    }
  },

  api_keys: {
    etherscan: Config.etherscanApiKey
  },

  plugins: [
    'truffle-plugin-verify'
  ]

};
