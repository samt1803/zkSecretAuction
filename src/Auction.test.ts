import { AccountUpdate, Field, Mina, PrivateKey, PublicKey } from 'o1js';
import { Auction } from './Auction';

let proofsEnabled = true;

describe('Add', () => {
  let deployerAccount: Mina.TestPublicKey,
    deployerKey: PrivateKey,
    bidder1: Mina.TestPublicKey,
    bidder2: Mina.TestPublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: Auction;

  beforeAll(async () => {
    if (proofsEnabled) await Auction.compile();
  });

  beforeAll(async () => { // TODO - this should be moved to a `beforeEach` block, do localDeploy() in each test
    const Local = await Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    [deployerAccount, bidder1, bidder2] = Local.testAccounts;
    deployerKey = deployerAccount.key;
    senderKey = bidder1.key;

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new Auction(zkAppAddress);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('generates and deploys the `Auction` smart contract', async () => {
    await localDeploy();
    const num = zkApp.highestBid.get();
    expect(num).toEqual(Field(0));
  });

  test('successfully bids, giving secret to hide own identity', async () => {
    // await localDeploy();
    const txn = await Mina.transaction(bidder1, async () => {
      await zkApp.bid(Field(2), Field(123456));
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    const updatedNum = zkApp.highestBid.get();
    expect(updatedNum).toEqual(Field(2));
  });

  test('cant bid lower than current highest bid', async () => {
    // await localDeploy();
    await Mina.transaction(bidder1, async () => {
      try {
        await zkApp.bid(Field(1), Field(123456));
      } catch (e: any) {
        expect(e.message).toMatch("Field.assertLessThan(): expected 2 < 1");
      }
    });
  });

  test('highest bidder reveals identity', async () => {
    // await localDeploy();
    const revealTxn = await Mina.transaction(bidder1, async () => {
      await zkApp.reveal(Field(123456));
    });
    await revealTxn.prove();
    await revealTxn.sign([senderKey]).send();
  });

  it('fails if highest bidder reveals identity with wrong secret', async () => {
    // await localDeploy();
    await Mina.transaction(bidder1, async () => {
      try {
        await zkApp.reveal(Field(123457));
      } catch (e: any) {
        expect(e.message).toMatch("Field.assertEquals()");
      }
    });
  });

  it('fails if someone else tries to reveal identity, even if knowing the secret', async () => {
    // await localDeploy();
    await Mina.transaction(bidder2, async () => {
      try {
        await zkApp.reveal(Field(123456));
      } catch (e: any) {
        expect(e.message).toMatch("Field.assertEquals()");
      }
    });
  });
});