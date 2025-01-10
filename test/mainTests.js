const { ethers } = require("hardhat")
const { expect } = require("chai");
describe("deploy factory", function () {
    // beforeEach(async () => {
    //     const CompanyFactory = await ethers.getContractFactory('CompanyFactory')
    //     contract = CompanyFactory.deploy()
    // })
    it("should deploy", async function () {
        const CompanyFactory = await ethers.getContractFactory('CompanyFactory')
        const contract = await CompanyFactory.deploy()
        await contract.deployed()
        const res = await contract.deployCollection('name', 'url', 'adress', 'adress')
        // const res2 = await contract.mintCollectible(0, 1, 1, 'token name', 'url')
        // console.log(res2)
        await contract.on('CollectionCreated', function (owner, collecionAdress, collectionIndex) {
            console.log("owner", owner)
            console.log("collecionAdress", collecionAdress)
            console.log('collectionIndex', collectionIndex)
        })
        contract.on('CollectibleMinted', function (owner,
            tokenContract,
            tokenId,
            amount) {
            console.log("owner", owner)
            console.log("tokenContract", tokenContract)
            console.log('tokenId', tokenId)
            console.log('amount', amount)
        })
        expect(res).to.be.not.null;
    })
})