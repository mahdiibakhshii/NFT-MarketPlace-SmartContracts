require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// task("deploy", "Deploy the smart contracts", async (taskArgs, hre) => {

//   const Collection = await hre.ethers.getContractFactory("Collection");
//   const collection = await Collection.deploy();

//   await collection.deployed();

//   await hre.run("verify:verify", {
//     address: collection.address,
//     constructorArguments: [
//       "Collection Contract",
//       "nft Collection"
//     ]
//   })

// })

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  settings: {
    allowUnlimitedContractSize: true,
    optimizer: {
      enabled: true,
      runs: 1
    }
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/cEWuTHpdQ6CWZEpJfvrA6TVSYhfSnNgj',
      accounts: [`0x${'17a640885f583152ab0ca8d442916d89127f16935b84a1a7536fb6a0f2978048'}`],
    },
    matic: {
      url: 'https://rpc-mumbai.maticvigil.com/v1/add6e950c76ea969c7afc70655ff2c1e2182256e',
      accounts: [`0x${'aaeaf1e1f1b2067bc9a76e38776fde629be85faa0e2de5602858e8e468a7c642'}`],
    }
  },
  etherscan: {
    apiKey: '1ZIGEI9MC24T255E9B1PMSP1W7QHXVR62Z'
  },
};