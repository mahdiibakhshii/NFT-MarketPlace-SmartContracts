Company Smart Contracts Document

In this Document, we focus on explaining Smart Contracts that have been implemented to handle required web3 logics on Company NFT Marketplace. These Logics have been splitted into 3 smart contracts. In the following, each one would be explained.

**CompanyFactory contract**

This contract is the core contract of the project and it has 3 functions that would be called by the user. CompanyFactory contract is developed to create a collection or mint a collectible beside storing required data about created collections(owner and contract address). This contract acts like an endpoint for CompanyCollection contract.Users call this contract to interact with CompanyCollection. As mentioned above, these functions would be called by users directly with their provider (Metamask). In addition, there are 2 events that would inform the backEnd about the created collection or minted collectible.

**Functions specification :**

- **deployCollection Function**

The aim of this method is creating a collection whose owner is the requested user..For calling this method a transaction should be created and sent because there is storing data logic on it. This transaction would be created at frontEnd and would be sent by the user's metamask account. In the code, a new instance of CompanyCollection contract would be created which returns the created collection address and then store the address and create an index with the purpose of accessing to the stored address in other methods and logics. This would be achieved by creating a mapping between the index and contract address beside creating a mapping between index and owner of the collection. In the last the event for creating a collection would be emitted to inform frontEnd and backEnd about the result of the procedure.

Inputs :

1. **\_collectionName :** the name the user wrote in FrontEnd.
2. **\_collectionUri :** The IPFS URL of the collection.
3. **\_symbol :** The symbol of the collection. It's a string and is going to be written by the user in frontEnd.
4. **\_id :** The id of the created collection on the BackEnd. Its mongoID and BackEnd provides it.
5. **\_traderContract :** The address of the traderContract (will be explained) which should be approved to transfer collectible. This data exists on the FrontEnd.

- **mintCollectible Function**

This method is for creating (minting) a collectible on a deployed collection on CompanyFactory contract. The code would call the mint function of the created instance of CompanyCollection contract and then emit the result with CollectibleMinted event to inform FrontEnd and BackEnd. For calling this method a transaction should be created and sent because there is storing data logic on it.

Inputs :

1. **\_index :** The index of the collection which the collectible is going to be minted on. This data is on the backEnd.
2. **id :** The id of the collectible in the collection. This data would be handled on the backEnd and starts from 1 and would be incremented by each mint.
3. **amount :** The number of collectible copies that the user specified in the FrondEnd create collectible form.
4. **name :** The name of collectible that the user specified in the FrondEnd create collectible form.
5. **\_collectionUri :** The updated url of the collection's metadata in the IPFS. This data would be handled on the BackEnd.
6. **royaltyPercentage :** The amount of the royalty that the user specified in the FrondEnd create collectible form.

- **getERC1155byIndexAndId Function**

This method is for returning requested collectible data. No transaction needs for calling this function because it's just reading the stored data.

Inputs :

1. **\_index :** The index of the collection which the collectible is going to be minted on. This data is on the backEnd.
2. **\_id :** The collectible tokenId on the collection. This data is on the backEnd.

Returns :

1. **\_contract :** The collection address
2. **\_owner :** Collectible owners
3. **\_uri :** The url of the collectible metadata json file on the IPFS
4. **Supply :** the number of copies that the creator of the collectible has on this collectible.

**Events specification :**

- **CollectionCreated event**

This event emitted when a collection is created successfully.

Event parameters :

1. **collectionAdress :** The address of the created collection.
2. **collectionIndex :** the index of the created collection on the CompanyFactory contract.
3. **itemId :** The id of the created collection on the BackEnd.
4. **Owner :** The public address of the collection owner.

- **CollectibleMinted event**

This event emitted when a collectible is created successfully.

Event parameters :

1. **tokenContract :** The address of the collection which collectible is minted on.
2. **tokenId :** The minted collectible tokenId on the collection.
3. **royaltyPercentage :** The amount of the royalty of the collectible.
4. **owner :** The public address of the collectible owner.

**CompanyCollection contract**

This contract handles the functionalities about calling minting logics of OpenZeppelin library and store attributes of a collection. This OpenZeppeling library handles all required logics about NFT in ERC1155 network .When CompanyFactory creates an instance of CompanyCollection contract, it actually creates a NFT collection so the minting function of this instance would be used to create a new Collectible on this collection. In addition, this contract stores metadata about the collection like name, symbol, collection folder in IPFS and collectible ids.

**Attributes specification :**

- collectibleNames : An Array to store all minted collectible names in this collection.
- collectibleIds : An Array to store all minted collectible ids in this collection.
- baseMetaDataURI : The URL of the folder in IPFS which contains minted collectibles metadata there. This URL updates when a new collectible mints.
- name : The collection name.
- Symbol : The collection symbol.

**Functions specification :**

- **constructor :**

The constructor calls when CompanyFactory creates a new instance of CompanyCollection with initial data. In its logic, baseMetaDataURI and name and symbol would be stored in the CompanyCollection and also calls some OpenZeppelin functions. These calls are for setting collection IPFS URI (this must be set if we want our collections will be shown on other marketplaces like rarible) and setting the creator of the collection as the owner of the collection(for being approved to change the collection in further requests) and also make the CompanyTrader contract (which handles auction and purchase process) to have the permission to change the collection (like transfer a NFT ownership).

- **URI Function :**

This function is for returning the URL of the requested collectible metadata file (which is a json file) at IPFS network. The logic appends the input (tokenID) to the collection baseURL with a '.json' at its end. The result addresses the NFT metadata file. Its readOnly function so No transaction to access this function is needed.

Inputs :

1. \_tokenId : The id of the NFT on the collection which has been requested.

Outputs :

1. A string with content of NFT metadata URI

- **getNames Function :**

This function is readOnly one so no transaction is needed. The aim is returning the names of all minted collectibles on this collection.

Outputs :

1. Array of strings contains minted collectible names.

- **setURI Function :**

This is a function to call the OpenZeppelin \_setURI function.

Inputs :

1. Newuri : The new url of the collection on the IPFS.

- **Mint Function :**

This function aims to store the updated collectionURI, collectibleID and collectibleName beside calling the \_mint function of OpenZeppelin library. This function is called by CompanyFactory contract and is payable so it needs a transaction to run.

Inputs :

1. Account : Public address of Collectible creator.
2. \_id : The id of the collectible in the collection.
3. Amount : Number of collectible copies.
4. collectibleName : The name of the collectible.
5. \_collectionUri : The IPFS URI for collection folder.
6. \_royaltyPercentage : The royalty that creator wants to have on his/her collectible. This number must be between 0 to 50 (the integer value of a percentage like : 33% =\> 33)

Outputs :

1. tokenId : The id of the minted collectible on this collection.
