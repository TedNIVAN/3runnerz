import { Client, TokenId, TransferTransaction } from '@hashgraph/sdk'

export async function sendTransaction(accountId, memo, amount) {
    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this reallyyy easy!
    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    const tokenId = TokenId.fromString("0.0.300642");
    console.log(`token id = ${tokenId}`);

    await (await new TransferTransaction()
        .addTokenTransfer(tokenId, client.operatorAccountId, -amount)
        .addTokenTransfer(tokenId, accountId, amount)
        .setTransactionMemo(memo)
        .execute(client))
        .getReceipt(client);

    console.log(`Sent ${amount} tokens from account ${client.operatorAccountId} to account ${accountId} on token ${tokenId}`);

    window.location.replace("leaderboard.html");
}

