require('babel-register');
require('babel-polyfill');

require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  contracts_build_directory: 'src/abis',
  
  networks: {
    
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    },
/*
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNENOMIC,
          'https://rinkeby.infura.io/v3/bfc770af659a4cb1acafcc2a25a9f1bc'
        ),
      network_id: 4,
      gas: 4600000,
      //gasPrice: web3.toWei("20", "gwei"),
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },


    mainnet: {
      provider: mainNetProvider,
      gas: 4600000,
      gasPrice: web3.toWei("20", "gwei"),
      network_id: "1",
    }
    */
    
  "rules": {
    "max-line-length": ["error",1200]
  }
    
  }
  
};
