const ProviderEngine = require('web3-provider-engine');
const FiltersSubprovider = require('web3-provider-engine/subproviders/filters');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc');
const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker');
const WalletSubprovider = require('web3-provider-engine/subproviders/wallet');
const EthereumjsWallet = require('ethereumjs-wallet');

function PrivateKeyProvider(privateKey, providerUrl) {

  if (!privateKey) {
    throw new Error(`Private Key missing, non-empty string expected, got '${privateKey}'`);
  }

  if (!providerUrl) {
    throw new Error(`Provider URL missing, non-empty string expected, got '${providerUrl}'`);
  }

  this.wallet = EthereumjsWallet.fromPrivateKey(Buffer.from(privateKey, 'hex'));
  // this.address = '0x' + this.wallet.getAddress().toString('hex');

  this.engine = new ProviderEngine();

  this.engine.addProvider(new FiltersSubprovider());
  this.engine.addProvider(new NonceSubprovider());
  this.engine.addProvider(new WalletSubprovider(this.wallet, {}));
  this.engine.addProvider(new RpcSubprovider({ rpcUrl: providerUrl }));

  this.engine.start();

}

PrivateKeyProvider.prototype.sendAsync = function() {
  this.engine.sendAsync.apply(this.engine, arguments);
};

PrivateKeyProvider.prototype.send = function() {
  return this.engine.send.apply(this.engine, arguments);
};


module.exports = PrivateKeyProvider;