# zkSecretAuction
small testproject in the scope of the encode zero knowledge bootcamp using o1.js and the Mina blockchain

first test-deployment to mina testnet:   
https://minascan.io/devnet/tx/5Jtg8RxDAEcCWY5tgR31Q5HxXDzKeXhh2JPsxDFf29UE66BwQczg?type=zk-tx

bid
https://minascan.io/devnet/tx/5JuiL5kptx2YXvnkCSodPCZzJSAtYwS3KK7Hxnqx3FTwnLfn388c?type=zk-tx

reveal
https://minascan.io/devnet/tx/5Jtj4vvZ2uHKQ3jxTAAomgwDKiyVVhP3jgzLRYn12hHMZWq8pD44?type=zk-tx







run project:
bun install
bun run test


interact with onchain
https://docs.minaprotocol.com/zkapps/tutorials/deploying-to-a-network

run interact script to call methods on devnet chain:
build typescript into js:
bun/npm run build

this will create js in build folder, then:

node build/src/interact.js zkauction





Secret Auction
- ... advantages of private voting/auctions
- hidden bidders, privacy
- verifyable onchain

Technical 
- Mina, o1js
- Typescript
- low entrance barrier
- look at Protokit

achieved
- 2 versions:
    - simple, all data onchain, "cleartext"
        - local tests, deployed to devnet, interaction script
    - data is offchain in merkletrees, merkle roots stored onchain
        - local tests


