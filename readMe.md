## Goldananas contract

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
    
- Ropsten: 
    - GoldenAnanasScore: 0xB1F3031A4ed1548711783A8eCC18104468650609
    - GoldenAnanasRanGk: 0xd63EG96454361b1d18c3a88460dD966634acDaBE5
    - TrophyToken: 0x62448c4bFf3B8aA89DA05E56fFc22017CcDD5e0f
    - GoldenAnanas: 0x24C08142dD48ca242DdC2D08220666f7F1d5bB3f

