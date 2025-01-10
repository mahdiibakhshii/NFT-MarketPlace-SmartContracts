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
      url: 'https://polygon-mumbai.g.alchemy.com/v2/smthing...',
      accounts: [`0x${'smthing...'}`],
    },
    matic: {
      url: 'https://rpc-mumbai.maticvigil.com/v1/smthing...',
      accounts: [`0x${'smthing...'}`],
    }
  },
  etherscan: {
    apiKey: 'smthing...'
  },
};