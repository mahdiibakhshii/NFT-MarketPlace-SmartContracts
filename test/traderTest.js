const { ethers } = require("hardhat")
const { expect } = require("chai");
// describe('check setSellOrder', function () {
//     it("should set a sell order", async function () {
//         const CompanyFactory = await ethers.getContractFactory('CompanyFactory')
//         const CompanyFactory = await CompanyFactory.deploy()
//         await CompanyFactory.deployed()
//         const collection = await CompanyFactory.deployCollection('name', 'url', 'symbol', 'undefiened')
//         const res2 = await CompanyFactory.mintCollectible(0, 1, 10, 'token name', 'url', "undefiened")
//         const CompanyTrader = await ethers.getContractFactory('CompanyTrader')
//         const CompanyTrader = await CompanyTrader.deploy()
//         await CompanyTrader.deployed()
//         // console.log("CompanyTrader address", CompanyTrader.address)s
//         // console.log("collection Address: ", await collection.wait())
//         let receipt = await collection.wait();
//         const collectionAddress = receipt.events?.filter((x) => { return x.event == "CollectionCreated" })[0].args[0];
//         const collectionIndex = receipt.events?.filter((x) => { return x.event == "CollectionCreated" })[0].args[1];
//         // console.log("collectionAddress", collectionAddress)
//         await CompanyTrader.setSellOrder(50, collectionAddress, 1)
//         // console.log(await CompanyTrader.getSellOrder(collectionAddress, 1))

//     })
// })
describe('verify signed message', function () {
    it('should check the signer of the signature', async function () {
        const [owner] = await ethers.getSigners();
        const CompanyTrader = await ethers.getContractFactory('CompanyTrader')
        const CompanyTrader = await CompanyTrader.deploy()
        await CompanyTrader.deployed()
        const msg = 'contractAddress:0x569d3657afa9d2bba1b7a7d85e5738f5ebd6aedb,tokenId:4,price:10000000000000000,amount:100'
        const hashed = '0x44fc129c1b6fe61d504eaac33cf1ac71edcde395c3fb7b3552a721afaf4c14bf'
        // const sig = await owner.signMessage(ethers.utils.arrayify(hash))
        const sig = "0x8e0923197016f1bf625dd4494b605fe9db0d2ca2d09c25a20f5e080a10831e1f79e13b7d48fbf2239fefec7d72fbe5c3480214efcc204edfe9b90ee46a917a571c"
        const signerAddress = '0xa9b8f4ce7b958296e1bf1a6dd7c6a0b694de05b3'
        const collectionAddress = '0x569D3657aFa9d2bBa1b7A7D85E5738f5ebd6AeDB'
        const tokenId = 4
        const price = ethers.utils.parseEther("0.01")
        const amount = 100
        const pureMessage = await CompanyTrader.getMessage('0x569D3657aFa9d2bBa1b7A7D85E5738f5ebd6AeDB', 5, ethers.utils.parseEther("0.01"), 100)
        console.log({ pureMessage })
        let verifyResult = await CompanyTrader.verify(signerAddress, msg, sig)
        console.log(verifyResult)
    })
})