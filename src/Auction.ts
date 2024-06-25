import { Field, SmartContract, state, State, method, Provable, AccountUpdate, Poseidon, MerkleWitness, MerkleTree } from 'o1js';

class AuctionMerkleWitness extends MerkleWitness(4) {}
export class Auction extends SmartContract {
  @state(Field) highestBidsMerkleRoot = State<Field>();
  @state(Field) highestBidderMerklRoot = State<Field>();

  init() {
    super.init();
    // this.highestBidHash.set(Field(0));
    this.highestBidsMerkleRoot.set(new MerkleTree(4).getRoot()); // 4 is the depth of the merkle tree
    this.highestBidderMerklRoot.set(new MerkleTree(4).getRoot());
  }

  @method async bid(
    auctionId: Field,
    oldAmountMerkleWitness: AuctionMerkleWitness,
    oldAmount: Field,
    // newAmountMerklWitness: MerkleMapWitness,
    newAmount: Field,
    oldHighestBidderMerkleWitness: AuctionMerkleWitness,
    secretePassword: Field
  ) {

    // verify that the old amount is correct and inside the merkle tree
    const calculatedOldAmount = oldAmountMerkleWitness.calculateRoot(oldAmount);
    this.highestBidsMerkleRoot.requireEquals(calculatedOldAmount);

    // const currentBid = this.highestBid.getAndRequireEquals();
    // amount.assertGreaterThan(currentBid);
    // const bidderBalance = this.account.balance.getAndRequireEquals();
    // const bidderBalanceBigInt = bidderBalance.toBigInt();

    // check if the bidder has enough balance
    const senderPubKey = this.sender.getAndRequireSignature();
    let accountUpdate = AccountUpdate.create(senderPubKey);
    let balance = accountUpdate.account.balance.get();
    balance.value.assertGreaterThan(newAmount);
    newAmount.assertGreaterThan(oldAmount);

    // update the highest bid merkle tree
    const newHighestBidsMerkleRoot = oldAmountMerkleWitness.computeRootAndKey(newAmount)[0];
    this.highestBidsMerkleRoot.set(newHighestBidsMerkleRoot);

    // update the highest bidder merkle tree
    const newHighestBidderHash = Poseidon.hash(senderPubKey.toFields().concat(secretePassword));
    const newHighestBidderMerkleRoot = oldHighestBidderMerkleWitness.computeRootAndKey(newHighestBidderHash)[0];


    // this.highestBid.set(amount);
    // this.currentHighestBidderHash.set(Poseidon.hash(senderPubKey.toFields().concat(secretPassword)));

    // this.highestBid.set(
    //   Provable.if(amount.greaterThan(currentBid), amount, currentBid)
    // );
    // this.currentHighestBidder.set(this.account.);
  }

  @method async reveal(secretPassword: Field) {
    // const currentBidderHash = this.currentHighestBidderHash.getAndRequireEquals();
    // const senderPubKey = this.sender.getAndRequireSignature();
    // const hash = Poseidon.hash(senderPubKey.toFields().concat(secretPassword));
    // currentBidderHash.assertEquals(hash);
  }


  // @method async update(square: Field) {
  //   const currentState = this.num.get();
  //   this.num.requireEquals(currentState);
  //   square.assertEquals(currentState.mul(currentState));
  //   this.num.set(square);
  // }
}
