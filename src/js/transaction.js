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


    //Create the transfer transaction
    const transferTransactionResponse = await new TransferTransaction()
        .addHbarTransfer(myAccountId, Hbar.fromTinybars(-amount))
        .addHbarTransfer(accountId, Hbar.fromTinybars(amount))
        .setTransactionMemo(memo)
        .execute(client);

    //Verify the transaction reached consensus
    const transactionReceipt = await transferTransactionResponse.getReceipt(client);
    console.log("The transfer transaction from my account to the new account was: " + transactionReceipt.status.toString());

    checkTx(transactionReceipt.status.toString());

    //Check the new account's balance
    const getNewBalance = await new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(client);

    console.log("The account balance after the transfer is: " + getNewBalance.hbars.toTinybars() + " tinybar.");

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