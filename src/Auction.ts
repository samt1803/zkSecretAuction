import { Field, SmartContract, state, State, method, Provable, AccountUpdate, Poseidon, MerkleWitness, MerkleTree } from 'o1js';

export class AuctionMerkleWitness extends MerkleWitness(2) { }
export class Auction extends SmartContract {
  @state(Field) highestBidsMerkleRoot = State<Field>();
  @state(Field) highestBidderMerklRoot = State<Field>();

  init() {
    super.init();
    // this.highestBidHash.set(Field(0));
    this.highestBidsMerkleRoot.set(new MerkleTree(2).getRoot()); // 4 is the depth of the merkle tree
    this.highestBidderMerklRoot.set(new MerkleTree(2).getRoot());
  }

  @method async bid(
    // auctionId: Field,
    highestBidMerkleWitness: AuctionMerkleWitness,
    oldAmount: Field,
    // newAmountMerklWitness: MerkleMapWitness,
    newAmount: Field,
    currentBidderMerkleWitness: AuctionMerkleWitness,
    secretePassword: Field
  ) {

    // verify that the old amount is correct and inside the merkle tree
    const calculatedOldHighestBidMerkleRoot = highestBidMerkleWitness.calculateRoot(oldAmount);
    this.highestBidsMerkleRoot.requireEquals(calculatedOldHighestBidMerkleRoot);

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
    const newHighestBidsMerkleRoot = highestBidMerkleWitness.calculateRoot(newAmount);
    this.highestBidsMerkleRoot.set(newHighestBidsMerkleRoot);

    // update the bidder merkle tree
    const newHighestBidderHash = Poseidon.hash(senderPubKey.toFields().concat(secretePassword));
    const newHighestBidderMerkleRoot = currentBidderMerkleWitness.calculateRoot(newHighestBidderHash);
    this.highestBidderMerklRoot.set(newHighestBidderMerkleRoot);


    // this.highestBid.set(amount);
    // this.currentHighestBidderHash.set(Poseidon.hash(senderPubKey.toFields().concat(secretPassword)));

    // this.highestBid.set(
    //   Provable.if(amount.greaterThan(currentBid), amount, currentBid)
    // );
    // this.currentHighestBidder.set(this.account.);
  }

  @method async reveal(highestBidderMerkleWitness: AuctionMerkleWitness, secretPassword: Field) {
    const senderPubKey = this.sender.getAndRequireSignature();
    const calculatedHash = Poseidon.hash(senderPubKey.toFields().concat(secretPassword));
    const calculatedMerkleRoot = highestBidderMerkleWitness.calculateRoot(calculatedHash);
    this.highestBidderMerklRoot.requireEquals(calculatedMerkleRoot);
  }


  // @method async update(square: Field) {
  //   const currentState = this.num.get();
  //   this.num.requireEquals(currentState);
  //   square.assertEquals(currentState.mul(currentState));
  //   this.num.set(square);
  // }
}
