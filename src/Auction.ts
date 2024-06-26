import { Field, SmartContract, state, State, method, AccountUpdate, Poseidon } from 'o1js';

export class Auction extends SmartContract {
  @state(Field) highestBid = State<Field>();
  @state(Field) currentHighestBidderHash = State<Field>();

  init() {
    super.init();
    this.highestBid.set(Field(0));
  }

  @method async bid(amount: Field, secretPassword: Field) {
    const currentBid = this.highestBid.getAndRequireEquals();

    const senderPubKey = this.sender.getAndRequireSignature();
    let accountUpdate = AccountUpdate.create(senderPubKey);
    let balance = accountUpdate.account.balance.get();
    balance.value.assertGreaterThan(amount);
    amount.assertGreaterThan(currentBid);

    this.highestBid.set(amount);
    this.currentHighestBidderHash.set(Poseidon.hash(senderPubKey.toFields().concat(secretPassword)));
  }

  @method async reveal(secretPassword: Field) {
    const currentBidderHash = this.currentHighestBidderHash.getAndRequireEquals();
    const senderPubKey = this.sender.getAndRequireSignature();
    const hash = Poseidon.hash(senderPubKey.toFields().concat(secretPassword));
    currentBidderHash.assertEquals(hash);
  }
}
