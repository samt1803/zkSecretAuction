import { Field, MerkleMap, MerkleTree, Poseidon, PublicKey } from "o1js";
import { AuctionMerkleWitness } from "./Auction";

export class OffChainStorage {
  highestBids: MerkleTree;
  highestBidders: MerkleTree;
  // nullifierMerkleMap: MerkleMap;

  // constructor(num_voters: number, options: number, voters: Field[]) {
  //   this.votersMerkleTree = new MerkleTree(num_voters + 1);
  //   this.voteCountMerkleTree = new MerkleTree(options + 1);
  //   this.nullifierMerkleMap = new MerkleMap();
  //   this.votersMerkleTree.fill(voters);
  // }

  // updateOffChainState(nullifierHash: Field, voteOption: bigint) {
  //   this.nullifierMerkleMap.set(nullifierHash, Field(1));
  //   const currentVote = this.voteCountMerkleTree.getNode(0, voteOption);
  //   this.voteCountMerkleTree.setLeaf(voteOption, currentVote.add(1));
  // }

  constructor() {
    this.highestBids = new MerkleTree(2);
    this.highestBidders = new MerkleTree(2);
  }

  updateupdateOffChainState(auctionId: Field, bidderPubkey: PublicKey, secretPassword: Field, amount: Field) {
    this.highestBids.setLeaf(auctionId.toBigInt(), amount);
    const bidderHash = Poseidon.hash(bidderPubkey.toFields().concat(secretPassword));
    this.highestBidders.setLeaf(auctionId.toBigInt(), bidderHash);
  }

  getBidWitness(auctionId: Field): AuctionMerkleWitness {
    return new AuctionMerkleWitness(this.highestBids.getWitness(auctionId.toBigInt()));
  }

  getBidderWitness(auctionId: Field): AuctionMerkleWitness {
    return new AuctionMerkleWitness(this.highestBidders.getWitness(auctionId.toBigInt()));
  }

  displayTree(mtree: MerkleTree) {
    let output = '';
    let h = mtree.height;
    for (let i = 0; i < h; i++) {
      // console.log('Level:', i);
      output += 'Level: ' + i + ':';
      for (let j = 0; j < 2 ** (h - 1 - i); j++) {
        // console.log(mtree.getNode(i, BigInt(j)).toString());
        output += mtree.getNode(i, BigInt(j)).toString() + ' ';
      }
    }
    console.log(output);
  }
}
