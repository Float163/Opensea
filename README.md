# Simple ERC-721 Token contract

Verified contract - 

Try running some of the following tasks:

Local deploy
```shell
npx hardhat run scripts/deploy.ts --network localhost
```

Rinkeby deploy
```shell
npx hardhat run scripts/deploy.ts --network rinkeby
```

Test
```shell
npx hardhat test
```

Verify
```shell
npx hardhat verify --network rinkeby <contract address> <token name> <token symbol> <decimals> <totalSupply>
```

Mint
```shell
npx hardhat mint --recipient <address> 
```
