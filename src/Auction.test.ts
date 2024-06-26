import { AccountUpdate, Field, Mina, PrivateKey, PublicKey } from 'o1js';
import { Auction } from './Auction';
import { OffChainStorage } from './offchainLogic';

let proofsEnabled = true;

describe('Add', () => {
  let deployerAccount: Mina.TestPublicKey,
    deployerKey: PrivateKey,
    bidder1: Mina.TestPublicKey,
    bidder2: Mina.TestPublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: Auction,
    offChainStorage: OffChainStorage;

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

    offChainStorage = new OffChainStorage();

    await localDeploy();
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

  test('successfully bids, giving secret to hide own identity', async () => {
    // await localDeploy();
    const auctionId = Field(0);
    const secretPassword = Field(123456);
    const amount = Field(2);

    console.log("tree before update");
    offChainStorage.displayTree(offChainStorage.highestBids);
    offChainStorage.updateupdateOffChainState(auctionId, bidder1, secretPassword, amount);
    console.log("tree after update");
    offChainStorage.displayTree(offChainStorage.highestBids);

    const txn = await Mina.transaction(bidder1, async () => {
      await zkApp.bid(
        offChainStorage.getBidWitness(auctionId),
        Field(0),
        amount,
        offChainStorage.getBidderWitness(auctionId),
        secretPassword
      )
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    const merklerootFromContract = zkApp.highestBidsMerkleRoot.get();
    const merklerootFromOffChain = offChainStorage.highestBids.getRoot();
    expect(merklerootFromContract).toEqual(merklerootFromOffChain);
  });

  test('successfully bid on second auction', async () => {
    // await localDeploy();
    const auctionId = Field(1);
    const secretPassword = Field(123456);
    const amount = Field(1);

    console.log("tree before update");
    offChainStorage.displayTree(offChainStorage.highestBids);
    offChainStorage.updateupdateOffChainState(auctionId, bidder1, secretPassword, amount);
    console.log("tree after update");
    offChainStorage.displayTree(offChainStorage.highestBids);

    const txn = await Mina.transaction(bidder1, async () => {
      await zkApp.bid(
        offChainStorage.getBidWitness(auctionId),
        Field(0),
        amount,
        offChainStorage.getBidderWitness(auctionId),
        secretPassword
      )
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    const merklerootFromContract = zkApp.highestBidsMerkleRoot.get();
    const merklerootFromOffChain = offChainStorage.highestBids.getRoot();
    expect(merklerootFromContract).toEqual(merklerootFromOffChain);
  });

  test('highest bidder reveals identity', async () => {
    const auctionId = Field(0);

    // await localDeploy();
    const revealTxn = await Mina.transaction(bidder1, async () => {
      await zkApp.reveal(offChainStorage.getBidderWitness(auctionId), Field(123456));  
    });
    await revealTxn.prove();
    await revealTxn.sign([senderKey]).send();
  });

  test('cant bid lower or equal to current highest bid', async () => {
    // await localDeploy();
    const auctionId = Field(0);
    const secretPassword = Field(123456);
    const amount = Field(2);
    // try to bid with same amount
    await Mina.transaction(bidder1, async () => {
      try {
        await zkApp.bid(
          offChainStorage.getBidWitness(auctionId),
          Field(0),
          amount,
          offChainStorage.getBidderWitness(auctionId),
          secretPassword
        );
      } catch (e: any) {
        expect(e.message).toMatch("Field.assertLessThan(): expected 2 < 1");
      }
    });
  });

  it('fails if highest bidder reveals identity with wrong secret', async () => {
    // await localDeploy();
    await Mina.transaction(bidder1, async () => {
      try {
        await zkApp.reveal(offChainStorage.getBidderWitness(Field(0)), Field(123457)); // 123456 would be correct
      } catch (e: any) {
        expect(e.message).toMatch("Field.assertEquals()");
      }
    });
  });

  it('fails if someone else tries to reveal identity, even if knowing the secret', async () => {
    // await localDeploy();
    await Mina.transaction(bidder2, async () => {
      try {
        await zkApp.reveal(offChainStorage.getBidderWitness(Field(0)), Field(123457));
      } catch (e: any) {
        expect(e.message).toMatch("Field.assertEquals()");
      }
    });
  });
});