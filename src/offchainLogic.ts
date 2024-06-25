import { Field, MerkleMap } from "o1js";

class OffChainStorage {
    highestBids: MerkleMap;
    highestBidders: MerkleMap;
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

    updateupdateOffChainState(auctionId:Field, bidder: Field, amount: Field) {
      this.highestBids.set(auctionId, amount);
      this.highestBidders.set(auctionId, bidder);
    }
  }