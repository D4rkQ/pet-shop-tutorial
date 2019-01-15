var HDWalletProvider = require("truffle-hdwallet-provider");
var MNEMONIC = "ancient net perfect garden dune next negative dog eight glove twice grain";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
      ropsten: {
          provider: function() {
              return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/548546602b184e56802cabe1ff80ddc9")
          },
          network_id: 3,
          gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
      }
  },
    compilers: {
        solc: {
            version: "0.4.24"  // ex:  "0.4.20". (Default: Truffle's installed solc)
        }
    }
};
