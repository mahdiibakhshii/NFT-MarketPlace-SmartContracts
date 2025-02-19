// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // const CompanyFactory = await ethers.getContractFactory("CompanyFactory");
  // const CompanyFactory = await CompanyFactory.deploy();

  // console.log("CompanyFactory address:", CompanyFactory.address);

  const CompanyTrader = await ethers.getContractFactory("CompanyTrader");
  const CompanyTrader = await CompanyTrader.deploy();

  console.log("CompanyTrader address:", CompanyTrader.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
