# zkSecretAuction
small testproject in the scope of the encode zero knowledge bootcamp using o1.js and the Mina blockchain

first test-deployment to mina testnet:   
https://minascan.io/devnet/tx/5Jtg8RxDAEcCWY5tgR31Q5HxXDzKeXhh2JPsxDFf29UE66BwQczg?type=zk-tx

bid
https://minascan.io/devnet/tx/5JuiL5kptx2YXvnkCSodPCZzJSAtYwS3KK7Hxnqx3FTwnLfn388c?type=zk-tx

reveal
https://minascan.io/devnet/tx/5Jtj4vvZ2uHKQ3jxTAAomgwDKiyVVhP3jgzLRYn12hHMZWq8pD44?type=zk-tx







run project:
``` bash
bun install
```
``` bash
bun run test
```


interact with onchain
https://docs.minaprotocol.com/zkapps/tutorials/deploying-to-a-network

run interact script to call methods on devnet chain:
build typescript into js:
``` bash
bun/npm run build
```
this will create js in build folder, then:
``` bash
node build/src/interact.js zkauction
```

