import { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction } from '@hashgraph/sdk'

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

    const tokenId = TokenId.fromString("0.0.272169");
    console.log(`token id = ${tokenId}`);
    
    //Create the transfer transaction
    const transferTransactionResponse = await new TransferTransaction()
        .addTokenTransfer(myAccountId, Hbar.fromTinybars(-amount))
        .addTokenTransfer(accountId, Hbar.fromTinybars(amount))
        .setTransactionMemo(memo)
        .execute(client);

        await (await (await new TokenAssociateTransaction()
        .setAccountId(accountId)
        .setTokenIds([tokenId])
        .freezeWith(client)
        .sign(myPrivateKey))
        .execute(client))
        .getReceipt(client);

        console.log(`Associated account ${accountId} with token ${tokenId}`);

        await (await new TokenGrantKycTransaction()
        .setAccountId(accountId)
        .setTokenId(tokenId)
        .execute(client))
        .getReceipt(client);

        console.log(`Granted KYC for account ${accountId} on token ${tokenId}`);
        
        await (await new TransferTransaction()
        .addTokenTransfer(tokenId, myAccountId, -amount)
        .addTokenTransfer(tokenId, accountId, amount)
        .execute(client))
        .getReceipt(client);

        console.log(`Sent 10 tokens from account ${myAccountId} to account ${accountId} on token ${tokenId}`);

    window.location.replace("success.html");
}

function checkTx(a) {
    console.log("hey 1");
    console.log(a);
    console.log("hey 2");
    if (a === "SUCCESS") {
        console.log("Youpi!");
    }
}