const { ethers } = require("hardhat")
const { expect } = require("chai");
// describe("verifySignature", function () {
//     it("check signature", async function () {
//         const VerifySignature = await ethers.getContractFactory('VerifySignature')
//         const contract = await VerifySignature.deploy()
//         await contract.deployed()
//         const accounts = await ethers.getSigners(2)
//         const signer = accounts[0]
//         const to = accounts[1].address
//         const amount = 999
//         const message = "{contractAddress:0x1eF26791FD10147dBD26Da7E1E9B6b13D57902c0,tokenId:3,price:1}"
//         const nonce = 123
//         const hash = await contract.getMessageHash(to, amount, message, nonce)
//         const sig = await signer.signMessage(ethers.utils.arrayify(hash))
//         const ethHash = await contract.getEthSignedMessageHash(hash)
//         console.log("signer             ", signer.address)
//         console.log("recovered signer:  ", await contract.recoverSigner(ethHash, sig))
//         expect(await contract.verify(signer.address, to, amount, message, nonce, sig)).to.equal(true)

//         expect(await contract.verify(signer.address, to, amount + 1, message, nonce, sig)).to.equal(false)
//     })
// })

describe("verifySignature metamask", function () {
    it("check metamask signature", async function () {
        const VerifySignature = await ethers.getContractFactory('VerifySignature')
        const contract = await VerifySignature.deploy()
        await contract.deployed()
        const accounts = await ethers.getSigners(2)
        const signer = accounts[0]
        const message = "{contractAddress:0xBCe7e078e06Fef18684cc7bbF013A8d0ADAb5E52,tokenId:2,price:0.1}"
        const hash = await contract.getMessageOnlyHash(message)
        const sig = await signer.signMessage(message)
        const ethHash = await contract.getEthSignedMessageHash(hash)
        const sig2 = '0xda3fa8e8e61964e7bae48a1a4d361655e39fc10770b40140087cc6ca8997f1fa20a2bfff693adba592de29876ec995213924f4b00e68ba70473afcc873358b741c'
        expect(await contract.verifyOnly('0xa9b8f4Ce7b958296e1BF1A6dd7c6a0b694DE05b3', message, sig2)).to.equal(true)

        expect(await contract.verifyOnly(signer.address, message + "1", sig)).to.equal(false)
    })
})
