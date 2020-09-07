## Golden ananas contract

This repository contains a set of Ethereum smart contract use to build a game in [Decentraland](https://decentraland.org) metaverse.
Game source is there: [https://github.com/julesGoullee/golden-ananas](https://github.com/julesGoullee/golden-ananas)

Contracts follow [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) implementations for: ERC20, ERC721, role-based permissioning scheme.

#### Contract architecture:

Designed to be modular and reduce risk by separate logic and data at the expense of transaction cost.
   
- `GoldenAnanasScore`: Save for every player progression and score for each level.
- `GoldenAnanasRank`: Using GoldenAnanasScore data, maintain a leaderboard of the best player globally, and by level.  
- `TrophyToken`: ERC721, mint when a player finished for the first time one level.  
- `GoldenAnanas`: Public and unique entry edpoint, orchestrate all the previously described contracts, no data store. Admin is allowed to withdraw ERC20 token.


##### Deployment addresses:

- Dev:
    - GoldenAnanasScore: 0xFD7b28e4ff19a052A0728DC9D7Cb4f8837CFaD04
    - GoldenAnanasRank: 0x750f39ABaaadA1E8d5cf6606c300aAeb5094857C
    - TrophyToken: 0x9aEAC5B72b511e9C746D912Bf2143F7BadfE58ee
    - GoldenAnanas: 0x407De3b78F391a75fC4F5b709E5C7aFB71174e9E
    - manaToken: 0x407De3b78F391a75fC4F5b709E5C7aFB71174e9E
    
- Ropsten: 
    - GoldenAnanasScore: 0x3EC2dAF32773EE07A9A6B48F507F42b7bf6160D5
    - GoldenAnanasRank: 0x224210abbE87993Ae0F3d47E5e4Ca2C61e497611
    - TrophyToken: 0x74550B5817CD3be52914f0C1A40b5784D2827844
    - GoldenAnanas: 0xe7d94aCE77779AfB9aC6467DEa1839D2277460b2
    - manaToken: 0xCEAdf25c74608e8945e44EDb025b7f1F40609787 (fake), 0x2a8fd99c19271f4f04b1b7b9c4f7cf264b626edb (from decentraland)
    

