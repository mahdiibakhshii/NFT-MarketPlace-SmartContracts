const { ethers } = require("hardhat")
const { expect } = require("chai");
describe('check Purchase', function () {
    it("should transfer token", async function () {
        const accounts = await ethers.getSigners()
        // DEPLOYING FACTORY
        const CompanyFactory = await ethers.getContractFactory('CompanyFactory')
        const CompanyFactory = await CompanyFactory.deploy()
        await CompanyFactory.deployed()
        //DEPLOY TRADER
        const CompanyTrader = await ethers.getContractFactory('CompanyTrader')
        const CompanyTrader = await CompanyTrader.deploy()
        await CompanyTrader.deployed()
        // console.log("trader:", CompanyTrader)
        //CREATE COLLECTION & COOLECTIBLE
        const collection = await CompanyFactory.deployCollection('name', 'url', 'symbol', 'undefiened', CompanyTrader.address)
        const res2 = await CompanyFactory.mintCollectible(0, 1, 10, 'token name', 'url', 10)
        let receipt = await collection.wait();
        // console.log("receipt:", receipt)
        const collectionAddress = receipt.events?.filter((x) => { return x.event == "CollectionCreated" })[0].args[0];
        console.log({ collectionAddress })
        // console.log("collectionAddress: ", collectionAddress)
        //CREATE SIGNATURE
        // const message = collectionAddress.toLowerCase() + 1 + ethers.utils.parseEther("1.0")
        // console.log("pure msg: ", message)
        // const hashed = ethers.utils.keccak256(message);
        // const arrayifyed = ethers.utils.arrayify(hashed);
        //SEND TRANSACTION
        // const b0 = await accounts[0].getBalance()
        // const b1 = await accounts[1].getBalance()
        // const b2 = await accounts[2].getBalance()
        // console.log("balance before 2:", await accounts[2].getBalance())
        // console.log("trader:", CompanyTrader.address)
        // console.log("factory:", CompanyFactory.address)
        // const price = 1
        // const serviceFee = ethers.utils.parseEther(((2 / 100) * price).toString())
        // console.log("msg:", await CompanyTrader.getMessage(collectionAddress.toLowerCase(), 1, ethers.utils.parseEther("1.0"), 7))
        // const signature = await accounts[0].signMessage(await CompanyTrader.getMessage(collectionAddress.toLowerCase(), 1, ethers.utils.parseEther("1.0"), 7))
        // console.log({ signature })
        // console.log("account[0]:", accounts[0].address)
        // const rawTxn = await CompanyTrader.connect(accounts[1]).populateTransaction.purchase(accounts[2].address, accounts[0].address, collectionAddress, serviceFee, 1, ethers.utils.parseEther("1.0"), 7, message, signature, { value: ethers.utils.parseEther((7 + ((2 / 100) * price)).toString()) })
        // const signedTxn = await accounts[1].sendTransaction(rawTxn)
        // const rawTxn2 = await CompanyTrader.connect(accounts[3]).populateTransaction.purchase(accounts[2].address, accounts[1].address, collectionAddress, serviceFee, 1, ethers.utils.parseEther("1.0"), 7, message, signature, { value: ethers.utils.parseEther((7 + ((2 / 100) * price)).toString()) })
        // const signedTxn2 = await accounts[3].sendTransaction(rawTxn2)
        // const rawTxn3 = await CompanyTrader.connect(accounts[4]).populateTransaction.purchase(accounts[2].address, accounts[3].address, collectionAddress, serviceFee, 1, ethers.utils.parseEther("1.0"), 1, message, signature, { value: ethers.utils.parseEther((1 + ((2 / 100) * price)).toString()) })
        // const signedTxn3 = await accounts[4].sendTransaction(rawTxn3)
        // let receipt2 = await signedTxn2.wait();
        // const result = await CompanyFactory.getERC1155byIndexAndId(0, 1)
        // console.log("trader:", CompanyTrader.address)
        // console.log("acc0:", accounts[0].address)
        // console.log("acc1:", accounts[1].address)
        // console.log("acc2:", accounts[2].address)
        // console.log("acc3:", accounts[3].address)

        // console.log("balance 0 diff:", (await accounts[0].getBalance()) - b0)
        // console.log("balance 1 diff:", (await accounts[1].getBalance()) - b1)
        // console.log("balance 2 diff:", (await accounts[2].getBalance()) - b2)

        // console.log({ result })
        // console.log('signedTXN:', signedTxn.hash)
        // console.log("balance after 0:", await accounts[0].getBalance())
        // console.log("balance after 1:", await accounts[1].getBalance())
        // console.log(receipt2)
    })
})
// describe('auction process', function () {
//     let accounts
//     let CompanyFactory
//     let CompanyFactory
//     let CompanyTrader
//     let CompanyTrader
//     let collection
//     let collectionAddress
//     beforeEach(async function () {
//         accounts = await ethers.getSigners()
//         // DEPLOYING FACTORY
//         CompanyFactory = await ethers.getContractFactory('CompanyFactory')
//         CompanyFactory = await CompanyFactory.deploy()
//         await CompanyFactory.deployed()
//         //DEPLOY TRADER
//         CompanyTrader = await ethers.getContractFactory('CompanyTrader')
//         CompanyTrader = await CompanyTrader.deploy()
//         await CompanyTrader.deployed()
//         //CREATE COLLECTION & COOLECTIBLE
//         collection = await CompanyFactory.deployCollection('name', 'url', 'symbol', 'undefiened', CompanyTrader.address)
//         const res2 = await CompanyFactory.mintCollectible(0, 1, 5, 'token name', 'url', 10)
//         let receipt = await collection.wait();
//         collectionAddress = receipt.events?.filter((x) => { return x.event == "CollectionCreated" })[0].args[0];

//     });
//     it("should throw INSUFFICIENT_FUNDS error. value is lower than floorPrice", async function () {
//         try {
//             const rawBid1 = await CompanyTrader.connect(accounts[3]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1.2'), 'signature', { value: ethers.utils.parseEther('0.9').toString() })
//             const signedBid1 = await accounts[3].sendTransaction(rawBid1);
//         } catch (e) {
//             expect(e.code).equal('INSUFFICIENT_FUNDS')
//         }
//     })
//     it("should throw INSUFFICIENT_FUNDS error. value is lower than bidAmount", async function () {
//         try {
//             const rawBid1 = await CompanyTrader.connect(accounts[3]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1.2'), 'signature', { value: ethers.utils.parseEther('1.1').toString() })
//             const signedBid1 = await accounts[3].sendTransaction(rawBid1);
//         } catch (e) {
//             expect(e.code).equal('INSUFFICIENT_FUNDS')
//         }
//     })
//     it("should throw INVALID_ARGUMENT error. owner is going to create a bid", async function () {
//         try {
//             const rawBid1 = await CompanyTrader.connect(accounts[0]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1.2'), 'signature', { value: ethers.utils.parseEther('1.2').toString() })
//             const signedBid1 = await accounts[3].sendTransaction(rawBid1);
//         } catch (e) {
//             expect(e.code).equal('INVALID_ARGUMENT')
//         }
//     })
//     it("should throw INVALID_ARGUMENT error. Auction has finished", async function () {
//         try {
//             const rawBid1 = await CompanyTrader.connect(accounts[3]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1.2'), 'signature', { value: ethers.utils.parseEther('1.2').toString() })
//             const signedBid1 = await accounts[3].sendTransaction(rawBid1);
//             const rawBid2 = await CompanyTrader.connect(accounts[4]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1.21'), 'signature', { value: ethers.utils.parseEther('1.21').toString() })
//             const signedBid2 = await accounts[4].sendTransaction(rawBid2);
//         } catch (e) {
//             expect(e.toString()).equal('Error: VM Exception while processing transaction: reverted with reason string \'auction has been finished.\'')
//         }
//     })
//     it("creating bid", async function () {
//         try {
//             console.log("account[3] 1:", (await accounts[3].getBalance()))
//             console.log("account[4] 1:", (await accounts[4].getBalance()))
//             console.log("account[5] 1:", (await accounts[5].getBalance()))
//             console.log("account[6] 1:", (await accounts[6].getBalance()))
//             console.log("account[7] 1:", (await accounts[7].getBalance()))
//             console.log("account[8] 1:", (await accounts[8].getBalance()))
//             const rawBid1 = await CompanyTrader.connect(accounts[3]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1.2'), 'signature', { value: ethers.utils.parseEther('1.2').toString() })
//             const signedBid1 = await accounts[3].sendTransaction(rawBid1);
//             const rawBid2 = await CompanyTrader.connect(accounts[4]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1.3'), 'signature', { value: ethers.utils.parseEther('1.3').toString() })
//             const signedBid2 = await accounts[4].sendTransaction(rawBid2);
//             const rawBid3 = await CompanyTrader.connect(accounts[5]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1.4'), 'signature', { value: ethers.utils.parseEther('1.4').toString() })
//             const signedBid3 = await accounts[5].sendTransaction(rawBid3);
//             const rawBid4 = await CompanyTrader.connect(accounts[6]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1.05'), 'signature', { value: ethers.utils.parseEther('1.05').toString() })
//             const signedBid4 = await accounts[6].sendTransaction(rawBid4);
//             const rawBid5 = await CompanyTrader.connect(accounts[7]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1.06'), 'signature', { value: ethers.utils.parseEther('1.06').toString() })
//             const signedBid5 = await accounts[7].sendTransaction(rawBid5);
//             console.log("account[3] 2:", (await accounts[3].getBalance()))
//             console.log("account[4] 2:", (await accounts[4].getBalance()))
//             console.log("account[5] 2:", (await accounts[5].getBalance()))
//             console.log("account[6] 2:", (await accounts[6].getBalance()))
//             console.log("account[7] 2:", (await accounts[7].getBalance()))
//             console.log("account[8] 2:", (await accounts[8].getBalance()))
//             const rawBid6 = await CompanyTrader.connect(accounts[8]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1.3'), 'signature', { value: ethers.utils.parseEther('1.3').toString() })
//             const signedBid6 = await accounts[8].sendTransaction(rawBid6);
//             console.log("account[3] 3:", (await accounts[3].getBalance()))
//             console.log("account[4] 3:", (await accounts[4].getBalance()))
//             console.log("account[5] 3:", (await accounts[5].getBalance()))
//             console.log("account[6] 3:", (await accounts[6].getBalance()))
//             console.log("account[7] 3:", (await accounts[7].getBalance()))
//             console.log("account[8] 3:", (await accounts[8].getBalance()))
//             // const rawBid7 = await CompanyTrader.connect(accounts[9]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1.25'), 'signature', { value: ethers.utils.parseEther('1.25').toString() })
//             // const signedBid7 = await accounts[9].sendTransaction(rawBid7);
//             // const rawBid8 = await CompanyTrader.connect(accounts[10]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1.08'), 'signature', { value: ethers.utils.parseEther('1.08').toString() })
//             // const signedBid8 = await accounts[10].sendTransaction(rawBid8);
//             // const rawBid9 = await CompanyTrader.connect(accounts[11]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1'), 'signature', { value: ethers.utils.parseEther('1').toString() })
//             // const signedBid9 = await accounts[11].sendTransaction(rawBid9);
//             // const rawBid10 = await CompanyTrader.connect(accounts[12]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1.25'), 'signature', { value: ethers.utils.parseEther('1.25').toString() })
//             // const signedBid10 = await accounts[12].sendTransaction(rawBid10);
//             // const rawBid11 = await CompanyTrader.connect(accounts[13]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1.4'), 'signature', { value: ethers.utils.parseEther('1.4').toString() })
//             // const signedBid11 = await accounts[13].sendTransaction(rawBid11);
//             // const rawBid12 = await CompanyTrader.connect(accounts[14]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1'), ethers.utils.parseEther('1.5'), 'signature', { value: ethers.utils.parseEther('1.5').toString() })
//             // const signedBid12 = await accounts[14].sendTransaction(rawBid12);
//             console.log("finishinggg: ");
//             await CompanyTrader.leadersListExplorer(collectionAddress, 1, 1)
//             console.log("account[0] 1:", (await accounts[0].getBalance()))
//             console.log("account[9] 1:", (await accounts[9].getBalance()))
//             await CompanyTrader.connect(accounts[2]).finishAuction(collectionAddress, 1, 1, 'some sig', accounts[9].address, 1)
//             console.log("account[0] 2:", (await accounts[0].getBalance()))
//             console.log("account[9] 2:", (await accounts[9].getBalance()))

//         } catch (e) {
//             expect(e.toString()).equal('Error: VM Exception while processing transaction: reverted with reason string \'auction has been finished.\'')
//         }
//     })
//     // console.log("acount[2] 1: ", (await accounts[2].getBalance()))
//     // const rawBid2 = await CompanyTrader.connect(accounts[2]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1.3'), { value: ethers.utils.parseEther('1.3').toString() })
//     // const signedBid2 = await accounts[2].sendTransaction(rawBid2);
//     // console.log("acount[2] 2: ", (await accounts[2].getBalance()))
//     // console.log("acount[3] 3: ", (await accounts[3].getBalance()))
//     // await CompanyTrader.getAuctionState(collectionAddress, 1, 1)
//     // await CompanyTrader.getAuctionState(collectionAddress, 2, 1)
//     // console.log("acount[4] 1: ", (await accounts[4].getBalance()))
//     // const rawBid3 = await CompanyTrader.connect(accounts[4]).populateTransaction.createBid(collectionAddress, 1, 1, accounts[0].address, ethers.utils.parseEther('1.4'), { value: ethers.utils.parseEther('1.4').toString() })
//     // const signedBid3 = await accounts[4].sendTransaction(rawBid3);
//     // console.log("acount[2] 3: ", (await accounts[2].getBalance()))
//     // console.log("acount[4] 2: ", (await accounts[4].getBalance()))
//     // await CompanyTrader.connect(accounts[5]).finishAuction(collectionAddress, 1, 1)
//     // console.log("acount[4] 3: ", (await accounts[4].getBalance()))
//     // console.log("acount[0] 2: ", (await accounts[0].getBalance()))
//     // const result = await CompanyFactory.getERC1155byIndexAndId(0, 1)
//     // console.log({ result })
//     // const rawBid21 = await CompanyTrader.connect(accounts[3]).populateTransaction.createBid(collectionAddress, 1, 2, accounts[4].address, ethers.utils.parseEther('1.2'), { value: ethers.utils.parseEther('1.2').toString() })
//     // const signedBid21 = await accounts[3].sendTransaction(rawBid21);
//     // await CompanyTrader.connect(accounts[5]).finishAuction(collectionAddress, 1, 2)
//     // console.log("acount[4] 4: ", (await accounts[4].getBalance()))
//     // console.log("acount[3] 4: ", (await accounts[3].getBalance()))
//     // const result2 = await CompanyFactory.getERC1155byIndexAndId(0, 1)
//     // console.log({ result2 })

//     // await CompanyTrader.getAuctionState(collectionAddress, 1, 1)
//     // await CompanyTrader.getAuctionState(collectionAddress, 2, 1)
// })
// describe('transfer token by owner', function () {
//     let accounts
//     let CompanyFactory
//     let CompanyFactory
//     let CompanyTrader
//     let CompanyTrader
//     let collection
//     let collectionAddress
//     beforeEach(async function () {
//         accounts = await ethers.getSigners()
//         // DEPLOYING FACTORY
//         CompanyFactory = await ethers.getContractFactory('CompanyFactory')
//         CompanyFactory = await CompanyFactory.deploy()
//         await CompanyFactory.deployed()
//         //DEPLOY TRADER
//         CompanyTrader = await ethers.getContractFactory('CompanyTrader')
//         CompanyTrader = await CompanyTrader.deploy()
//         await CompanyTrader.deployed()
//         //CREATE COLLECTION & COOLECTIBLE
//         collection = await CompanyFactory.deployCollection('name', 'url', 'symbol', 'undefiened', CompanyTrader.address)
//         const res2 = await CompanyFactory.mintCollectible(0, 1, 5, 'token name', 'url', 10)
//         let receipt = await collection.wait();
//         collectionAddress = receipt.events?.filter((x) => { return x.event == "CollectionCreated" })[0].args[0];

//     });
//     it('should transfer token by owner', async function () {
//         console.log("account[0] 1:", (await accounts[0].getBalance()))
//         const rawBidTxn1 = await CompanyTrader.connect(accounts[0]).populateTransaction.transferTokenByOwner(collectionAddress, 1, accounts[1].address, 1)
//         const signedTxn1 = await accounts[0].sendTransaction(rawBidTxn1);
//     })
//     it('should burn token by owner', async function () {
//         console.log("account[0] 1:", (await accounts[0].getBalance()))
//         const result = await CompanyFactory.getERC1155byIndexAndId(0, 1)
//         console.log({ result })
//         const rawBidTxn1 = await CompanyTrader.connect(accounts[0]).populateTransaction.burnTokenByOwner(collectionAddress, 1, 5)
//         const signedTxn1 = await accounts[0].sendTransaction(rawBidTxn1);
//         const result2 = await CompanyFactory.getERC1155byIndexAndId(0, 1)
//         console.log({ result2 })
//     })
// })