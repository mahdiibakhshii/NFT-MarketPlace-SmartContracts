//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CompanyCollection is ERC1155, Ownable {
    string[] public collectibleNames; //string array of names
    uint256[] public collectibleIds; //uint array of ids
    string public baseMetadataURI; //the token metadata URI
    string public name; //the token name
    string public symbol;

    constructor(
        string memory _collectionName,
        string memory _collectionUri,
        string memory _symbol,
        address _traderContract
    ) ERC1155(_collectionUri) {
        setURI(_collectionUri);
        baseMetadataURI = _collectionUri;
        name = _collectionName;
        symbol = _symbol;
        transferOwnership(tx.origin);
        _setApprovalForAll(tx.origin, _traderContract, true);
    }

    function uri(uint256 _tokenid)
        public
        view
        override
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    baseMetadataURI,
                    Strings.toString(_tokenid),
                    ".json"
                )
            );
    }

    function getNames() public view returns (string[] memory) {
        return collectibleNames;
    }

    function setURI(string memory newuri) internal {
        _setURI(newuri);
    }

    function mint(
        address account,
        uint256 _id,
        uint256 amount,
        string memory collectibleName,
        string memory _collectionUri,
        uint16 _royaltyPercentage
    ) public payable returns (uint256) {
        setURI(_collectionUri);
        collectibleIds.push(_id);
        collectibleNames.push(collectibleName);
        baseMetadataURI = _collectionUri;
        _mint(account, collectibleIds.length, amount, _royaltyPercentage, "");
        return collectibleIds.length;
    }
}
