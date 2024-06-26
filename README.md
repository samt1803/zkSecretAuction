# Silent Bid Auction

## Overview
This project introduces a novel approach to auctions, emphasizing privacy and verifiability through advanced cryptographic techniques. By leveraging zkSync and the o1js library, it offers a secure and efficient platform for conducting secret auctions where bidders' identities remain hidden until the end of the auction. This model combines the benefits of private voting mechanisms with the transparency and security guarantees of blockchain technology.
This repository contains the test suite for a zkSync-based secret auction smart contract. The contract allows participants to bid secretly, with the highest bidder revealed only after the auction ends.

### Advantages
* Privacy: Participants can bid anonymously, enhancing privacy and fairness.
* Verifiability: All auction activities are recorded on-chain, allowing for transparent verification.
* Efficiency: Utilizes zkSync for fast and low-cost transactions, thanks to its rollup technology.

### Technical Details
* Framework: Built with Mina Protocol and o1js, taking advantage of zkRollups for scalability and efficiency.
* Programming Language: Developed using TypeScript, offering strong typing and modern development practices.
* Low Entrance Barrier: Designed to be accessible, with guidance on setting up the development environment and running tests.



## Imports and Setup
* The code imports necessary modules from o1js, a library for working with zkSync, and a custom Auction module.
* Variables are declared for various accounts and keys involved in the tests, including deployer and bidder accounts, the zkSync app's public and private keys, and the zkSync 
 app instance itself.


## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Run Project](#run-project)
- [Running Test](#running-tests)
- [Deploy on Mina](#deploy-to-mina-network)
- [Contract Interaction](#contract-interaction)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have Node.js and npm installed on your machine. You will also need to install the following dependencies:

- `jest` for testing framework
- `@o1js/mina` for interacting with zkSync

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


Link to the short presentation:

https://docs.google.com/presentation/d/19Opnz1cHMeUGcMn0ES3juVdEhMLtayhVS7jqIDaKuZU/edit?usp=sharing

