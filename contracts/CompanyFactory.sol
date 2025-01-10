//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "./CompanyCollection.sol";

contract CompanyFactory {
    CompanyCollection[] public collectionTokens;
    mapping(uint256 => address) public indexToContract;
    mapping(uint256 => address) public indexToOwner;

    event CollectionCreated(
        address collecionAdress,
        uint256 collectionIndex,
        string itemId,
        address owner
    );
    event CollectibleMinted(
        address tokenContract,
        uint256 tokenId,
        uint16 royaltyPercentage,
        address owner
    );

    function deployCollection(
        string memory _collectionName,
        string memory _collectionUri,
        string memory _symbol,
        string memory _id,
        address _traderContract
    ) public returns (address) {
        CompanyCollection t = new CompanyCollection(
            _collectionName,
            _collectionUri,
            _symbol,
            _traderContract
        );
        collectionTokens.push(t);
        uint256 index = collectionTokens.length - 1;
        indexToContract[index] = address(t);
        indexToOwner[index] = msg.sender;
        emit CollectionCreated(address(t), index, _id, msg.sender);
        return address(t);
    }

    function mintCollectible(
        uint256 _index,
        uint256 id,
        uint256 amount,
        string memory name,
        string memory _collectionUri,
        uint16 royaltyPercentage
    ) public {
        uint256 tokenId = collectionTokens[_index].mint(
            indexToOwner[_index],
            id,
            amount,
            name,
            _collectionUri,
            royaltyPercentage
        );
        emit CollectibleMinted(
            address(collectionTokens[_index]),
            tokenId,
            royaltyPercentage,
            tx.origin
        );
    }

    function getERC1155byIndexAndId(uint256 _index, uint256 _id)
        public
        view
        returns (
            address _contract,
            address _owner,
            string memory _uri,
            uint256 supply
        )
    {
        CompanyCollection token = collectionTokens[_index];
        return (
            address(token),
            token.owner(),
            token.uri(_id),
            token.balanceOf(indexToOwner[_index], _id)
        );
    }
}
