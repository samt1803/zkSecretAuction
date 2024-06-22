import { Field, SmartContract, state, State, method, Provable, AccountUpdate, Poseidon } from 'o1js';

/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The Add contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the Add contract adds Field(2) to its 'num' contract state.
 *
 * This file is safe to delete and replace with your own contract.
 */
export class Auction extends SmartContract {
  @state(Field) highestBid = State<Field>();
  @state(Field) currentHighestBidderHash = State<Field>();

  init() {
    super.init();
    this.highestBid.set(Field(0));
  }

  @method async bid(amount: Field, secretPassword: Field) {
    const currentBid = this.highestBid.getAndRequireEquals();
    // amount.assertGreaterThan(currentBid);
    // const bidderBalance = this.account.balance.getAndRequireEquals();
    // const bidderBalanceBigInt = bidderBalance.toBigInt();

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
