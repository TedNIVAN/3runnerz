import { serial } from './serial'
const { Client, PrivateKey, AccountCreateTransaction, TokenId, TokenAssociateTransaction, TransferTransaction, AccountBalanceQuery, Hbar, Mnemonic } = require("@hashgraph/sdk");
require("dotenv").config();

var port;

function registerDevice() {
    'use strict';
    console.log("fdfd");
    document.addEventListener('DOMContentLoaded', event => {

    });
}

var memo;
var accountId;
export var runners = ["001-soccer-player.png", "003-runner.png", "008-runner-1.png", "010-gymnast.png", "015-muay-thai.png", "016-volleyball-player.png", "021-water-polo-1.png", "031-archer.png", "033-wrestler-1.png", "039-weightlifting.png", "046-volleyball.png", "047-basketball-player.png"];
var count = 0;
var lastnameOkay = false;
var firstnameOkay = false;
var accountmdl;

class BulmaModal {
    constructor(selector) {
        this.elem = document.querySelector(selector)
        this.close_data()
    }

    show() {
        this.elem.classList.toggle('is-active')
        this.on_show()
    }

    close() {
        this.elem.classList.toggle('is-active')
        this.on_close()
    }

    close_data() {
        var modalClose = this.elem.querySelectorAll("[data-bulma-modal='close']")
        var that = this
        modalClose.forEach(function (e) {
            e.addEventListener("click", function () {

                that.elem.classList.toggle('is-active')

                var event = new Event('modal:close')

                that.elem.dispatchEvent(event);
            })
        })
    }

    on_show() {
        var event = new Event('modal:show')

        this.elem.dispatchEvent(event);
    }

    on_close() {
        var event = new Event('modal:close')

        this.elem.dispatchEvent(event);
    }

    addEventListener(event, callback) {
        this.elem.addEventListener(event, callback)
    }
}

async function registerComponent() {

    document.addEventListener('DOMContentLoaded', event => {

        accountmdl = new BulmaModal("#accountModal")

        accountmdl.addEventListener('modal:show', function () {
            console.log("opened")
        })

        accountmdl.addEventListener("modal:close", function () {
            console.log("closed")
        })

        document.getElementById("leftImg").src = runners[count];
        document.getElementById("midImg").src = runners[count + 1];
        document.getElementById("rightImg").src = runners[count + 2];

        document.getElementById("prevBtn").addEventListener("click", function () {
            console.log("prev");
            console.log("count: " + count);
            console.log("mod(count, runners.length) : " + mod(count, runners.length));
            console.log("mod(count+1, runners.length) : " + mod(count + 1, runners.length));
            console.log("mod(count+2, runners.length) : " + mod(count + 2, runners.length));
            count--;
            if (count > 0) {
                document.getElementById("leftImg").src = runners[count % runners.length];
                document.getElementById("midImg").src = runners[(count + 1) % runners.length];
                document.getElementById("rightImg").src = runners[(count + 2) % runners.length];
            } else {
                document.getElementById("leftImg").src = runners[mod(count, runners.length)];
                document.getElementById("midImg").src = runners[mod(count + 1, runners.length)];
                document.getElementById("rightImg").src = runners[mod(count + 2, runners.length)];
            }
        });

        document.getElementById("nextBtn").addEventListener("click", function () {
            console.log("next");
            console.log("count: " + count);
            console.log("count%runners.length : " + count % runners.length);
            console.log("(count+1)%runners.length : " + (count + 1) % runners.length);
            console.log("(count+2)%runners.length :" + (count + 2) % runners.length);
            count++;
            if (count > 0) {
                document.getElementById("leftImg").src = runners[count % runners.length];
                document.getElementById("midImg").src = runners[(count + 1) % runners.length];
                document.getElementById("rightImg").src = runners[(count + 2) % runners.length];
            } else {
                document.getElementById("leftImg").src = runners[mod(count, runners.length)];
                document.getElementById("midImg").src = runners[mod(count + 1, runners.length)];
                document.getElementById("rightImg").src = runners[mod(count + 2, runners.length)];
            }
        });

        document.getElementById("lastname").addEventListener('change', function () {
            if (this.value.length < 2) {
                document.getElementById("lastnameErr").style.visibility = "visible";
                document.getElementById("lastnameErr").innerText = "lastname must at least 2 characters";
                document.getElementById("lastname").classList.add("is-danger");
                lastnameOkay = false;
            }
            else if (this.value.length > 25) {
                document.getElementById("lastnameErr").style.visibility = "visible";
                document.getElementById("lastnameErr").innerText = "lastname must at most 25 characters";
                document.getElementById("lastname").classList.add("is-danger");
                lastnameOkay = false;
            }
            else {
                document.getElementById("lastnameErr").style.visibility = "hidden";
                document.getElementById("lastname").classList.remove("is-danger");
                lastnameOkay = true;
                document.getElementById("firstname").disabled = false;
            }
        });

        document.getElementById("firstname").addEventListener('change', function () {
            if (this.value.length < 2) {
                document.getElementById("firstnameErr").style.visibility = "visible";
                document.getElementById("firstnameErr").innerText = "firstname must at least 2 characters";
                document.getElementById("firstname").classList.add("is-danger");
                firstnameOkay = false;
            }
            else if (this.value.length > 25) {
                document.getElementById("firstnameErr").style.visibility = "visible";
                document.getElementById("firstnameErr").innerText = "firstname must at most 25 characters";
                document.getElementById("firstname").classList.add("is-danger");
                firstnameOkay = false;
            }
            else {
                document.getElementById("firstnameErr").style.visibility = "hidden";
                document.getElementById("firstname").classList.remove("is-danger");
                firstnameOkay = true;
                document.getElementById("terms").disabled = false;
            }
        });

        document.getElementById("terms").addEventListener('change', function () {
            if (this.checked) {
                document.getElementById("submit").disabled = false;
            } else {
                document.getElementById("submit").disabled = true;
            }
        });

        document.getElementById("submit").addEventListener("click", function () {

            var lastname = document.getElementById("lastname").value;

            var firstname = document.getElementById("firstname").value;

            var selectCountry = document.getElementById("country");
            var country = selectCountry.value;

            console.log(lastname);
            console.log(firstname);
            console.log(country);

            var avatar;

            if (count > 0) {
                avatar = (count + 1) % runners.length;
            } else {
                avatar = mod(count + 1, runners.length);
            }

            var memoObj = {avatar,firstname,lastname,country};

            console.log(memoObj);

            console.log("yaaaa");
            createAccount(memoObj);



        });
        var mdl = new BulmaModal("#termsModal")

        document.getElementById("termsbtn").addEventListener('click', event => {
            mdl.show()
        });
        mdl.addEventListener('modal:show', function () {
            console.log("opened")
        })

        mdl.addEventListener("modal:close", function () {
            console.log("closed")
        })

    });
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

registerComponent();

async function createAccount(memoObj) {

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

    //Create new keys
    const newAccountMnemonic = await Mnemonic.generate();
    const newAccountPrivateKey = await PrivateKey.fromMnemonic(newAccountMnemonic);
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    console.log("newAccountMnemonic: " + newAccountMnemonic);
    console.log(newAccountMnemonic.toString().split(" "));
    console.log("newAccountMnemonic: " + newAccountMnemonic);
    console.log("newAccountPrivateKey: " + newAccountPrivateKey);
    console.log("newAccountPublicKey: " + newAccountPrivateKey.publicKey);

    const mnemonic = newAccountMnemonic.toString().split(" ");
    document.getElementById("accountInfo").innerHTML = ``;
    mnemonic.forEach((e, i) => {
        document.getElementById("accountInfo").innerHTML +=
            `
        <div class="column is-3">
        <span class="tag is-rounded is-info is-light" style="width: 100px">${i + 1} | ${e}</span>
        </div>
        `;
    });

    accountmdl.show();

    footerMenu();

    //Create a new account with 1,000 tinybar starting balance
    const newAccountTransactionResponse = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
        //.setTransactionMemo(memo)
        .execute(client);

    // Get the new account ID
    const getReceipt = await newAccountTransactionResponse.getReceipt(client);
    const newAccountId = getReceipt.accountId;

    accountId = newAccountId;

    console.log("The new account ID is: " + newAccountId);

    //Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The new account balance is: " + accountBalance.hbars.toTinybars() + " tinybar.");

    //
    const tokenId = TokenId.fromString("0.0.300642");
    console.log(`token id = ${tokenId}`);
    const amount = 1000;

    await (await (await new TokenAssociateTransaction()
        .setAccountId(newAccountId)
        .setTokenIds([tokenId])
        .freezeWith(client)
        .sign(newAccountPrivateKey))
        .execute(client))
        .getReceipt(client);

    console.log(`Associated account ${newAccountId} with token ${tokenId}`);

    // No KYC

    memo = `{"avatar":${memoObj.avatar},"fullname":"${memoObj.firstname} ${memoObj.lastname}","accountId":"${newAccountId}","country":"${memoObj.country}"}`

    await (await (await new TransferTransaction()
        .addTokenTransfer(tokenId, client.operatorAccountId, -amount)
        .addTokenTransfer(tokenId, newAccountId, amount)
        .setTransactionMemo(memo)
        .sign(newAccountPrivateKey))
        .execute(client))
        .getReceipt(client);

    console.log(`Sent ${amount} tokens from account ${client.operatorAccountId} to account ${newAccountId} on token ${tokenId}`);

    document.getElementById("mnemonicBtn").disabled = false;
}

function footerMenu() {

    document.getElementById("mnemonicBtn").addEventListener('click', () => {
        document.getElementById("modal-card-foot").innerHTML =
        `
        <button class="button" id="accountidBtn">I wrote down my account id</button>
        `;
        document.getElementById("modal-card-title").innerHTML = `Account creation completed`;
        document.getElementById("alert").innerHTML = `Write down your account id`;

        document.getElementById("accountInfo").innerHTML =
        `
        <div class="column" style="margin: 30px">
        <span class="tag is-info is-large is-light">${accountId}</span>
        </div>
        `;

        document.getElementById("accountidBtn").addEventListener('click', () => {
            document.getElementById("modal-card-title").innerHTML = `Device registration`;
            document.getElementById("alert").innerHTML = `Connect your device`;
            document.getElementById("accountInfo").innerHTML =
            `
            <div class="column" style="margin: 30px">
            <figure class="image is-128x128">
            <img src="usb.png" alt="">
            </figure>
            </div>
            `;
            document.getElementById("modal-card-foot").innerHTML =
            `
            <button class="button" id="registerBtn">Register Device</button>
            `;

            let connectButton = document.querySelector('#registerBtn');

            function connect() {

                console.log('Connecting to ' + port.device_.productName + '...');
                port.connect().then(() => {
                    console.log(port);
                    console.log('Connected.');

                    let textEncoder = new TextEncoder();
                    console.log(accountId.toString());
                    var accId = accountId.toString();
                    let str = accId.slice(4, accId.length);
                    console.log(str);
                    port.send(textEncoder.encode(str)).catch(error => {
                        console.log('Send error: ' + error);
                    });

                    port.onReceive = data => {
                        let textDecoder = new TextDecoder();
                        console.log(("0.0." + textDecoder.decode(data)) === accountId.toString());

                        if (("0.0." + textDecoder.decode(data)) === accountId.toString()) {
                            document.getElementById("alertBox").innerHTML = ``;
                            document.getElementById("modal-card-title").innerHTML = `Registration completed`;

                            document.getElementById("accountInfo").innerHTML =
                                `
                                <div class="column" style="margin: 30px">
                                <figure class="image is-128x128">
                                <img src="tick.png" alt="">
                                </figure>
                                </div>
                                `;
                            document.getElementById("modal-card-foot").innerHTML =
                            `
                            <button class="button" id="closeBtn">Close</button>
                            `;
                            document.getElementById("closeBtn").addEventListener('click', () => {
                                window.location.replace("index.html");
                            });
                        }

                        console.log(textDecoder.decode(data));
                        try {
                            console.log(JSON.parse(textDecoder.decode(data)));
                        } catch (err) {
                            console.log(err);
                        }
                    }
                    port.onReceiveError = error => {
                        console.log('Receive error: ' + error);
                    };
                }, error => {
                    console.log('Connection error: ' + error);
                });
            };

            connectButton.addEventListener('click', function () {
                if (port) {
                    port.disconnect();
 
                    port = null;
                } else {
                    serial.requestPort().then(selectedPort => {
                        port = selectedPort;
                        connect();

                    }).catch(error => {
                        console.log('Connection error: ' + error);
                    });
                }
            });

            serial.getPorts().then(ports => {
                if (ports.length == 0) {
                    console.log('No devices found.');
                } else {
                    port = ports[0];
                    connect();
                }
            });

        });
    });

}


