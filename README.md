# Silent Bid Auction


## Link to the short presentation:

https://docs.google.com/presentation/d/19Opnz1cHMeUGcMn0ES3juVdEhMLtayhVS7jqIDaKuZU/edit?usp=sharing


## Overview
This project introduces a novel approach to auctions, emphasizing privacy and verifiability through advanced cryptographic techniques. By leveraging zkSync and the o1js library, it offers a secure and efficient platform for conducting secret auctions where bidders' identities remain hidden until the end of the auction. This model combines the benefits of private voting mechanisms with the transparency and security guarantees of blockchain technology.

### Advantages
* Privacy: Participants can bid anonymously, enhancing privacy and fairness.
* Verifiability: All proofs of auction activities are recorded on-chain, allowing for transparent verification.
* Efficiency: Utilizes mina for fast and low-cost transactions, thanks to its rollup technology.

### Technical Details
* Framework: Built with Mina Protocol and o1js, taking advantage of zkRollups for scalability and efficiency.
* Programming Language: Developed using TypeScript, offering strong typing and modern development practices.
* Low Entrance Barrier: Designed to be accessible, with guidance on setting up the development environment and running tests.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the required dependencies:

### Run Project
``` bash
bun install
```

### Running Tests
``` bash
bun run test
```

### Deploy to Mina Network
https://docs.minaprotocol.com/zkapps/tutorials/deploying-to-a-network


### Contract Interaction
build typescript into js:
``` bash
bun/npm run build
```
this will create js in build folder, then:
``` bash
node build/src/interact.js zkauction
```



first test-deployment to mina testnet:   
https://minascan.io/devnet/tx/5Jtg8RxDAEcCWY5tgR31Q5HxXDzKeXhh2JPsxDFf29UE66BwQczg?type=zk-tx

bid
https://minascan.io/devnet/tx/5JuiL5kptx2YXvnkCSodPCZzJSAtYwS3KK7Hxnqx3FTwnLfn388c?type=zk-tx

reveal
https://minascan.io/devnet/tx/5Jtj4vvZ2uHKQ3jxTAAomgwDKiyVVhP3jgzLRYn12hHMZWq8pD44?type=zk-tx



