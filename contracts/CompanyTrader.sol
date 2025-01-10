// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CompanyTrader {
    struct bidHistory {
        address bidder;
        uint256 amount;
    }
    struct bidInfo {
        address payable bidder;
        uint256 amount;
        uint256 next;
    }
    struct auction {
        uint8 state;
        uint256 startBlock;
        uint256 endBlock;
        address payable owner;
        uint256 bidCount;
        uint256 headBidId;
        mapping(uint256 => bidInfo) leadersList;
        bidHistory[] history;
    }
    mapping(address => mapping(uint256 => mapping(uint256 => auction)))
        public Auctions;
    uint256 public opNum;

    constructor() {
        opNum = 0;
    }

    //--- Events
    event CollectiblePurchased(
        address buyer,
        address seller,
        address collectionAdress,
        uint256 tokenId,
        uint256 price,
        uint256 amount,
        address receiver,
        uint256 royaltyAmount,
        uint256 opNum
    );
    event BidCreated(
        address collectionAddress,
        uint256 tokenId,
        uint256 auctionNum,
        address bidder,
        address seller,
        uint256 bidAmount,
        uint256 opNum
    );
    event AuctionStarted(
        address collectionAddress,
        uint256 tokenId,
        uint256 auctionNum,
        address auctioneer,
        uint256 opNum
    );
    event AuctionFinished(
        address collectionAddress,
        uint256 tokenId,
        uint256 auctionNum,
        address auctioneer,
        uint256 opNum
    );
    event BidWithdraw(
        address collectionAddress,
        uint256 tokenId,
        uint256 auctionNum,
        address bidder,
        address seller,
        uint256 amount,
        address newBidder,
        uint256 opNum
    );
    event RoyaltyTransfered(
        address collectionAddress,
        uint256 tokenId,
        address seller,
        address buyer,
        uint256 amount,
        uint256 copies,
        uint256 opNum
    );
    event AuctionWithdraw(
        address collectionAddress,
        uint256 tokenId,
        uint256 auctionNum,
        address owner,
        uint256 amount,
        uint256 opNum
    );
    event AuctionTransferToken(
        address collectionAddress,
        uint256 tokenId,
        uint256 auctionNum,
        address prevOwner,
        uint256 price,
        uint256 amount,
        address newOwner,
        uint256 opNum
    );
    event AuctionWithdrawServiceFee(
        address collectionAddress,
        uint256 tokenId,
        uint256 auctionNum,
        address owner,
        uint256 amount,
        address CompanyWallet,
        uint256 opNum
    );
    event TokenTransferedByOwner(
        address destAdderss,
        address ownerAddress,
        address collectionAddress,
        uint256 tokenId,
        uint256 amount,
        uint256 opNum
    );
    event TokenBurnedByOwner(
        address ownerAddress,
        address collectionAddress,
        uint256 tokenId,
        uint256 amount,
        uint256 opNum
    );

    //--- Auction logics
    function getAuctionState(
        address collectionAddress,
        uint256 tokenId,
        uint256 auctionNum
    ) public view returns (uint8) {
        return Auctions[collectionAddress][tokenId][auctionNum].state;
    }

    function startAuction(
        address collectionAddress,
        uint256 tokenId,
        uint256 auctionNum,
        address owner
    ) private returns (bool) {
        Auctions[collectionAddress][tokenId][auctionNum].state = 1;
        Auctions[collectionAddress][tokenId][auctionNum].startBlock = block
            .number;
        Auctions[collectionAddress][tokenId][auctionNum].owner = payable(owner);
        Auctions[collectionAddress][tokenId][auctionNum].bidCount = 0;
        emit AuctionStarted(
            collectionAddress,
            tokenId,
            auctionNum,
            owner,
            ++opNum
        );
        return true;
    }

    function addBidToLeaderBoard(
        address collectionAddress,
        uint256 tokenId,
        uint256 auctionNum,
        address payable bidder,
        uint256 bidAmount
    ) private returns (uint256) {
        require(
            leadersListExplorer(collectionAddress, tokenId, auctionNum) <
                getTokensCountOfOwner(
                    collectionAddress,
                    tokenId,
                    Auctions[collectionAddress][tokenId][auctionNum].owner
                ),
            "error in contract. leaderList.length is higher than available tokens."
        );
        uint256 id = Auctions[collectionAddress][tokenId][auctionNum].headBidId;
        address ownerPublicAddress = Auctions[collectionAddress][tokenId][
            auctionNum
        ].owner;
        if (
            Auctions[collectionAddress][tokenId][auctionNum]
                .leadersList[id]
                .amount < bidAmount
        ) {
            bidInfo memory newBid;
            newBid.bidder = bidder;
            newBid.amount = bidAmount;
            newBid.next = id;
            uint256 newBidId = ++Auctions[collectionAddress][tokenId][
                auctionNum
            ].bidCount;
            Auctions[collectionAddress][tokenId][auctionNum].leadersList[
                    newBidId
                ] = newBid;
            Auctions[collectionAddress][tokenId][auctionNum]
                .headBidId = newBidId;
            emit BidCreated(
                collectionAddress,
                tokenId,
                auctionNum,
                bidder,
                ownerPublicAddress,
                bidAmount,
                ++opNum
            );
        } else {
            do {
                uint256 nextId = Auctions[collectionAddress][tokenId][
                    auctionNum
                ].leadersList[id].next;
                if (
                    Auctions[collectionAddress][tokenId][auctionNum]
                        .leadersList[nextId]
                        .amount < bidAmount
                ) {
                    uint256 newBidId = ++Auctions[collectionAddress][tokenId][
                        auctionNum
                    ].bidCount;
                    bidInfo memory newBid;
                    newBid.bidder = bidder;
                    newBid.amount = bidAmount;
                    newBid.next = nextId;
                    Auctions[collectionAddress][tokenId][auctionNum]
                        .leadersList[id]
                        .next = newBidId;
                    Auctions[collectionAddress][tokenId][auctionNum]
                        .leadersList[newBidId] = newBid;
                    emit BidCreated(
                        collectionAddress,
                        tokenId,
                        auctionNum,
                        bidder,
                        ownerPublicAddress,
                        bidAmount,
                        ++opNum
                    );
                    break;
                }
                id = Auctions[collectionAddress][tokenId][auctionNum]
                    .leadersList[id]
                    .next;
            } while (id != 0);
        }
        return id;
    }

    function createBid(
        address collectionAddress,
        uint256 tokenId,
        uint256 auctionNum,
        address owner,
        uint256 floorPrice,
        uint256 bidAmount,
        string memory signature
    ) public payable {
        require(owner != msg.sender, "owner could not place any bid.");
        //TODO: checking signature
        require(
            Auctions[collectionAddress][tokenId][auctionNum].state != 2,
            "auction has been finished."
        );
        require(
            bidAmount <= msg.value,
            "insufficient funds sent. lower than bidAmount."
        );
        require(
            floorPrice <= msg.value,
            "insufficient funds sent. lower than floorPrice."
        );

        //checking for starting auction
        if (Auctions[collectionAddress][tokenId][auctionNum].state == 0) {
            startAuction(collectionAddress, tokenId, auctionNum, owner);
        }
        //check for removing last bid
        if (
            leadersListExplorer(collectionAddress, tokenId, auctionNum) ==
            getTokensCountOfOwner(collectionAddress, tokenId, owner)
        ) {
            //check if bidAmount is higher than the last bid
            require(
                getLastBidAmount(collectionAddress, tokenId, auctionNum) <
                    bidAmount,
                "bid amount is lower than the last approved bid."
            );
            removeLastBidOnTheLeaderBoard(
                collectionAddress,
                tokenId,
                auctionNum,
                msg.sender
            );
        }
        //creating new bid
        addBidToLeaderBoard(
            collectionAddress,
            tokenId,
            auctionNum,
            payable(msg.sender),
            bidAmount
        );
        // bid history
        bidHistory memory bid = bidHistory(msg.sender, bidAmount);
        Auctions[collectionAddress][tokenId][auctionNum].history.push(bid);
    }

    function removeLastBidOnTheLeaderBoard(
        address collectionAddress,
        uint256 tokenId,
        uint256 auctionNum,
        address newBidder
    ) private {
        uint256 id = Auctions[collectionAddress][tokenId][auctionNum].headBidId;
        uint256 nextId = 0;
        address ownerPublicAddress = Auctions[collectionAddress][tokenId][
            auctionNum
        ].owner;
        if (leadersListExplorer(collectionAddress, tokenId, auctionNum) == 1) {
            Auctions[collectionAddress][tokenId][auctionNum]
                .leadersList[id]
                .bidder
                .transfer(
                    Auctions[collectionAddress][tokenId][auctionNum]
                        .leadersList[id]
                        .amount
                );
            emit BidWithdraw(
                collectionAddress,
                tokenId,
                auctionNum,
                Auctions[collectionAddress][tokenId][auctionNum]
                    .leadersList[id]
                    .bidder,
                ownerPublicAddress,
                Auctions[collectionAddress][tokenId][auctionNum]
                    .leadersList[id]
                    .amount,
                newBidder,
                ++opNum
            );
            Auctions[collectionAddress][tokenId][auctionNum]
                .leadersList[id]
                .next = 0;
            Auctions[collectionAddress][tokenId][auctionNum]
                .leadersList[id]
                .bidder = payable(address(0));
            Auctions[collectionAddress][tokenId][auctionNum]
                .leadersList[id]
                .amount = 0;
            Auctions[collectionAddress][tokenId][auctionNum].headBidId = 0;
        } else {
            do {
                nextId = Auctions[collectionAddress][tokenId][auctionNum]
                    .leadersList[id]
                    .next;
                if (
                    Auctions[collectionAddress][tokenId][auctionNum]
                        .leadersList[nextId]
                        .next == 0
                ) {
                    Auctions[collectionAddress][tokenId][auctionNum]
                        .leadersList[id]
                        .next = 0;
                    Auctions[collectionAddress][tokenId][auctionNum]
                        .leadersList[nextId]
                        .bidder
                        .transfer(
                            Auctions[collectionAddress][tokenId][auctionNum]
                                .leadersList[nextId]
                                .amount
                        );
                    emit BidWithdraw(
                        collectionAddress,
                        tokenId,
                        auctionNum,
                        Auctions[collectionAddress][tokenId][auctionNum]
                            .leadersList[nextId]
                            .bidder,
                        ownerPublicAddress,
                        Auctions[collectionAddress][tokenId][auctionNum]
                            .leadersList[nextId]
                            .amount,
                        newBidder,
                        ++opNum
                    );
                    Auctions[collectionAddress][tokenId][auctionNum]
                        .leadersList[nextId]
                        .bidder = payable(address(0));
                    Auctions[collectionAddress][tokenId][auctionNum]
                        .leadersList[nextId]
                        .amount = 0;
                }
                id = nextId;
            } while (id != 0);
        }
    }

    function leadersListExplorer(
        address collectionAddress,
        uint256 tokenId,
        uint256 auctionNum
    ) public view returns (uint256) {
        uint256 id = Auctions[collectionAddress][tokenId][auctionNum].headBidId;
        uint256 bidCount = 0;
        do {
            if (
                Auctions[collectionAddress][tokenId][auctionNum]
                    .leadersList[id]
                    .amount != 0
            ) bidCount++;
            id = Auctions[collectionAddress][tokenId][auctionNum]
                .leadersList[id]
                .next;
        } while (id != 0);
        return bidCount;
    }

    function getLastBidAmount(
        address collectionAddress,
        uint256 tokenId,
        uint256 auctionNum
    ) public view returns (uint256) {
        uint256 id = Auctions[collectionAddress][tokenId][auctionNum].headBidId;
        uint256 bidAmount = 0;
        do {
            if (
                Auctions[collectionAddress][tokenId][auctionNum]
                    .leadersList[id]
                    .next == 0
            ) {
                bidAmount = Auctions[collectionAddress][tokenId][auctionNum]
                    .leadersList[id]
                    .amount;
                break;
            }
            id = Auctions[collectionAddress][tokenId][auctionNum]
                .leadersList[id]
                .next;
        } while (id != 0);
        return bidAmount;
    }

    function getTokensCountOfOwner(
        address collectionAddress,
        uint256 tokenId,
        address owner
    ) public view returns (uint256) {
        ERC1155 token = ERC1155(collectionAddress);
        return token.balanceOf(owner, tokenId);
    }

    function transferToken(
        address collectionAddress,
        address collectiblePrevOwner,
        address collectibleNewOwner,
        uint256 tokenId,
        uint256 amount
    ) private {
        ERC1155 token = ERC1155(collectionAddress);
        require(
            token.balanceOf(collectiblePrevOwner, tokenId) >= amount,
            "not enough tokens exists!"
        );
        token.safeTransferFrom(
            collectiblePrevOwner,
            collectibleNewOwner,
            address(this),
            tokenId,
            amount,
            ""
        );
    }

    function transferTokenByOwner(
        address collectionAddress,
        uint256 tokenId,
        address newOwner,
        uint256 amount
    ) public {
        ERC1155 token = ERC1155(collectionAddress);
        require(
            token.balanceOf(msg.sender, tokenId) >= amount,
            "not enough tokens exists!"
        );
        transferToken(collectionAddress, msg.sender, newOwner, tokenId, amount);
        emit TokenTransferedByOwner(
            newOwner,
            msg.sender,
            collectionAddress,
            tokenId,
            amount,
            ++opNum
        );
    }

    function burnTokenByOwner(
        address collectionAddress,
        uint256 tokenId,
        uint256 amount
    ) public {
        ERC1155 token = ERC1155(collectionAddress);
        require(
            token.balanceOf(msg.sender, tokenId) >= amount,
            "not enough tokens exists!"
        );
        token.safeBurnFrom(msg.sender, tokenId, amount);
        emit TokenBurnedByOwner(
            msg.sender,
            collectionAddress,
            tokenId,
            amount,
            ++opNum
        );
    }

    function finishAuction(
        address collectionAddress,
        uint256 tokenId,
        uint256 auctionNum,
        string memory signature,
        address payable CompanyWallet,
        uint256 serviceFee
    ) public {
        //TODO: verify signature.
        uint256 bidCount = leadersListExplorer(
            collectionAddress,
            tokenId,
            auctionNum
        );
        require(
            bidCount <=
                getTokensCountOfOwner(
                    collectionAddress,
                    tokenId,
                    Auctions[collectionAddress][tokenId][auctionNum].owner
                ),
            "error in contract. leaderList.length is higher than available tokens."
        );
        ERC1155 token = ERC1155(collectionAddress);
        uint256 totalAmount = 0;
        address owner = Auctions[collectionAddress][tokenId][auctionNum].owner;
        if (bidCount > 0) {
            uint256 id = Auctions[collectionAddress][tokenId][auctionNum]
                .headBidId;
            do {
                transferToken(
                    collectionAddress,
                    Auctions[collectionAddress][tokenId][auctionNum].owner,
                    Auctions[collectionAddress][tokenId][auctionNum]
                        .leadersList[id]
                        .bidder,
                    tokenId,
                    1
                );
                address bidder = Auctions[collectionAddress][tokenId][
                    auctionNum
                ].leadersList[id].bidder;
                uint256 price = Auctions[collectionAddress][tokenId][auctionNum]
                    .leadersList[id]
                    .amount;
                emit AuctionTransferToken(
                    collectionAddress,
                    tokenId,
                    auctionNum,
                    owner,
                    price,
                    1,
                    bidder,
                    ++opNum
                );
                totalAmount += Auctions[collectionAddress][tokenId][auctionNum]
                    .leadersList[id]
                    .amount;
                id = Auctions[collectionAddress][tokenId][auctionNum]
                    .leadersList[id]
                    .next;
            } while (id != 0);
        }
        Auctions[collectionAddress][tokenId][auctionNum].state = 2;
        emit AuctionFinished(
            collectionAddress,
            tokenId,
            auctionNum,
            Auctions[collectionAddress][tokenId][auctionNum].owner,
            ++opNum
        );
        (address receiver, uint256 royaltyAmount) = token.royaltyInfo(
            tokenId,
            totalAmount - ((serviceFee * totalAmount) / 100)
        );
        Auctions[collectionAddress][tokenId][auctionNum].owner.transfer(
            (totalAmount - ((serviceFee * totalAmount) / 100)) - royaltyAmount
        );
        payable(receiver).transfer(royaltyAmount);
        CompanyWallet.transfer(((serviceFee * totalAmount) / 100));
        emit RoyaltyTransfered(
            collectionAddress,
            tokenId,
            receiver,
            owner,
            royaltyAmount,
            bidCount,
            ++opNum
        );
        emit AuctionWithdraw(
            collectionAddress,
            tokenId,
            auctionNum,
            owner,
            totalAmount - ((serviceFee * totalAmount) / 100),
            ++opNum
        );
        emit AuctionWithdrawServiceFee(
            collectionAddress,
            tokenId,
            auctionNum,
            owner,
            ((serviceFee * totalAmount) / 100),
            CompanyWallet,
            ++opNum
        );
    }

    //--- Instant Purchase logics
    function purchase(
        address payable CompanyWallet,
        address payable collectibleOwner,
        address collectionAddress,
        uint256 serviceFee,
        uint256 tokenId,
        uint256 price,
        uint256 amount,
        uint256 totalAmount,
        bytes memory signature
    ) public payable {
        require(
            msg.value - serviceFee >= price * amount,
            "insufficient funds sent"
        );
        // require(
        //     verify(
        //         collectibleOwner,
        //         getMessage(
        //             Strings.toHexString(uint160(collectionAddress), 20),
        //             tokenId,
        //             price,
        //             totalAmount,
        //             Strings.toHexString(uint160(CompanyWallet), 20),
        //             serviceFee
        //         ),
        //         signature
        //     ) == true,
        //     "signature is not verified."
        // );
        ERC1155 token = ERC1155(collectionAddress);
        (address receiver, uint256 royaltyAmount) = token.royaltyInfo(
            tokenId,
            price * amount
        );
        transferToken(
            collectionAddress,
            collectibleOwner,
            msg.sender,
            tokenId,
            amount
        );
        collectibleOwner.transfer(msg.value - royaltyAmount - serviceFee);
        payable(receiver).transfer(royaltyAmount);
        CompanyWallet.transfer(serviceFee);
        emit CollectiblePurchased(
            msg.sender,
            collectibleOwner,
            collectionAddress,
            tokenId,
            price,
            amount,
            receiver,
            royaltyAmount,
            ++opNum
        );
    }

    //--- Verifying signature logics
    function getMessageHash(string memory _message)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(_message));
    }

    function getEthSignedMessageHash(bytes32 _messageHash)
        public
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    _messageHash
                )
            );
    }

    function getMessage(
        string memory collectionAddress,
        uint256 tokenId,
        uint256 price,
        uint256 amount,
        string memory CompanyWallet,
        uint256 serviceFee
    ) public pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "contractAddress:",
                    collectionAddress,
                    ",tokenId:",
                    Strings.toString(tokenId),
                    ",price:",
                    Strings.toString(price),
                    ",amount:",
                    Strings.toString(amount),
                    ",CompanyWallet:",
                    CompanyWallet,
                    ",serviceFee:",
                    Strings.toString(serviceFee)
                )
            );
    }

    function verify(
        address _signer,
        string memory _message,
        bytes memory signature
    ) internal pure returns (bool) {
        bytes32 messageHash = getMessageHash(_message);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        return recoverSigner(ethSignedMessageHash, signature) == _signer;
    }

    function recoverSigner(
        bytes32 _ethSignedMessageHash,
        bytes memory _signature
    ) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}
