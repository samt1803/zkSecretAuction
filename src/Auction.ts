import { Field, SmartContract, state, State, method, Provable, AccountUpdate, Poseidon, Struct } from 'o1js';

export class Auction extends SmartContract {
  @state(Field) highestBidsMerkleRoot = State<Field>();
  @state(Field) highestBidderMerklRoot = State<Field>();

  init() {
    super.init();
    // this.highestBidHash.set(Field(0));
  }

  @method async bid(
    auctionId: Field,
    oldAmountMerkleWitness: Field,
    newAmount: Field,
    secretePassword: Field
  ) {

    const currentBid = this.highestBid.getAndRequireEquals();
    // amount.assertGreaterThan(currentBid);
    // const bidderBalance = this.account.balance.getAndRequireEquals();
    // const bidderBalanceBigInt = bidderBalance.toBigInt();

    // check if the bidder has enough balance
    const senderPubKey = this.sender.getAndRequireSignature();
    let accountUpdate = AccountUpdate.create(senderPubKey);
    let balance = accountUpdate.account.balance.get();
    balance.value.assertGreaterThan(amount);
    amount.assertGreaterThan(currentBid);

    this.highestBid.set(amount);
    this.currentHighestBidderHash.set(Poseidon.hash(senderPubKey.toFields().concat(secretPassword)));

    // this.highestBid.set(
    //   Provable.if(amount.greaterThan(currentBid), amount, currentBid)
    // );
    // this.currentHighestBidder.set(this.account.);
  }

  @method async reveal(secretPassword: Field) {
    const currentBidderHash = this.currentHighestBidderHash.getAndRequireEquals();
    const senderPubKey = this.sender.getAndRequireSignature();
    const hash = Poseidon.hash(senderPubKey.toFields().concat(secretPassword));
    currentBidderHash.assertEquals(hash);
  }


  // @method async update(square: Field) {
  //   const currentState = this.num.get();
  //   this.num.requireEquals(currentState);
  //   square.assertEquals(currentState.mul(currentState));
  //   this.num.set(square);
  // }
}
