import { sendTransaction } from './transaction'

require("dotenv").config();

var memo;
var accountId;
var runners = ["001-soccer-player.png", "003-runner.png", "008-runner-1.png", "010-gymnast.png", "015-muay-thai.png", "016-volleyball-player.png", "021-water-polo-1.png", "033-wrestler-1.png", "046-volleyball.png"];
var count = 0;
var fullnameOkay = false;
var accountIdOkay = true;

console.log(runners.length);

function isAlreadyTaken(accountId) {
    console.log(accountId);
    var xhr = new XMLHttpRequest();
    var runnerz = [];
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var res = JSON.parse(this.responseText);

            res.data.forEach(e => {
                try {
                    if (validate(JSON.parse(`${e.memo}`))) {
                        runnerz.push(JSON.parse(`${e.memo}`));
                        //console.log(runnerz);
                    }
                } catch (err) {
                    console.log(err);
                }
            });
            return checkRunnerz(accountId, runnerz)
        }


    });

    xhr.open("GET", "https://api-testnet.dragonglass.me/hedera/api/accounts/0.0.221495/transactions");
    xhr.onload = function () {
        runnerz.forEach(e => {
            console.log(e);
            if(e.accountId === accountId) {
                accountIdOkay = false;
            }

        });
        console.log(accountIdOkay);
    };
    xhr.setRequestHeader("X-API-KEY", process.env.DRAGONGLASS_KEY);

    xhr.send();


}

function checkRunnerz(accountId, runnerz) {
    runnerz.forEach(e => {
        console.log(e);
        if (e.accountId === accountId) {
            console.log("ya");
            return true;
        } else {
            console.log("no");
            return false;
        }
    });
}

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

        document.getElementById("fullname").addEventListener('change', function () {
            if (this.value.length < 2) {
                document.getElementById("fullnameErr").style.visibility = "visible";
                document.getElementById("fullnameErr").innerText = "fullname must at least 2 characters";
                document.getElementById("fullname").classList.add("is-danger");
                fullnameOkay = false;
                document.getElementById("accountId").disabled = true;
            }
            else if (this.value.length > 25) {
                document.getElementById("fullnameErr").style.visibility = "visible";
                document.getElementById("fullnameErr").innerText = "fullname must at most 25 characters";
                document.getElementById("fullname").classList.add("is-danger");
                fullnameOkay = false;
                document.getElementById("accountId").disabled = true;
            }
            else {
                document.getElementById("fullnameErr").style.visibility = "hidden";
                document.getElementById("fullname").classList.remove("is-danger");
                fullnameOkay = true;
                document.getElementById("accountId").disabled = false;
            }
        });

        document.getElementById("accountId").addEventListener('change', function () {
         
            if (this.value.length !== 10 || accountIdOkay === true) {
                document.getElementById("accountIdErr").style.visibility = "visible";
                document.getElementById("accountIdErr").innerText = "account Id invalid or already taken";
                document.getElementById("accountId").classList.add("is-danger");
                document.getElementById("submit").disabled = true;
                accountIdOkay = false;
                document.getElementById("terms").disabled = true;
                //address is already taken
            }
            else {
                document.getElementById("accountIdErr").style.visibility = "hidden";
                document.getElementById("accountId").classList.remove("is-danger");
                accountIdOkay = true;
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

            document.getElementById("submit").classList.add("is-loading");

            var fullname = document.getElementById("fullname").value;

            accountId = document.getElementById("accountId").value;

            var selectCountry = document.getElementById("country");
            var country = selectCountry.value;

            //var x = selectCountry.selectedIndex;
            //var y = selectCountry.options;
            //var countryId = y[x].index;

            console.log(fullname);
            console.log(accountId);
            console.log(country);

            var avatar;

            if (count > 0) {
                avatar = (count + 1) % runners.length;
            } else {
                avatar = mod(count + 1, runners.length);
            }

            memo = `{"avatar":${avatar},"fullname":"${fullname}","accountId":"${accountId}","country":"${country}"}`
            console.log(memo);

            sendTransaction(accountId, memo, 1000);

        });
        var mdl = new BulmaModal("#termsModal")
        //mdl.show()

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

//////

var jsen = require('jsen');
var validate = jsen(
    {
        type: 'object',
        minProperties: 4,
        maxProperties: 4,
        required: ['accountId', 'fullname', 'country', 'avatar'],
        properties: {
            accountId: { type: 'string' },
            fullname: { type: 'string' },
            country: { type: 'string' },
            avatar: { type: 'number' }
        },
        additionalProperties: false
    }
);

console.log(validate(JSON.parse(`{"avatar":0,"fullname":"Tony","accountId":"0.0.250439","country":"lb"}`)));

registerComponent();









