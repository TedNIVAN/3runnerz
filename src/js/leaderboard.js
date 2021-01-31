require("dotenv").config();
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

var runners = ["001-soccer-player.png", "003-runner.png", "008-runner-1.png", "010-gymnast.png", "015-muay-thai.png", "016-volleyball-player.png", "021-water-polo-1.png", "033-wrestler-1.png", "046-volleyball.png"];

function leaderboardComponent() {
    var xhr = new XMLHttpRequest();
    var runnerz = [];
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var res = JSON.parse(this.responseText);

            res.data.forEach(e => {
                try {
                    if (validate(JSON.parse(`${e.memo}`))) {
                        console.log(1);
                        runnerz.push(JSON.parse(`${e.memo}`));
                        console.log(runnerz);
                    }
                } catch (err) {
                    console.log(err);
                }
            });

            var table = document.getElementById("leaderboard");
            for (var i = 0; i < runnerz.length; i++) {
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);
                var cell7 = row.insertCell(6);
                var cell8 = row.insertCell(7);
                var cell9 = row.insertCell(8);
                cell1.innerHTML = `<strong>${runnerz.length - i}</strong>`;
                cell2.innerHTML = `<img src="${runners[runnerz[i].avatar]}" alt="" width="50px">`;
                cell3.innerHTML = runnerz[i].fullname;
                cell4.innerHTML = `<span class="flag-icon flag-icon-${runnerz[i].country}"></span>`;
                cell5.innerHTML = `<a target="_blank" href="https://explorer.kabuto.sh/testnet/id/${runnerz[i].accountId}">${runnerz[i].accountId}</a>`;
                cell6.innerHTML = 1000;
                cell7.innerHTML = 1;
                cell8.innerHTML = 2;
                cell9.innerHTML = 1;
                console.log(`<img src="assets/${runners[runnerz[i].avatar]}" alt="" width="75px">`);
            }
        }
    });

    xhr.open("GET", "https://api-testnet.dragonglass.me/hedera/api/accounts/0.0.221495/transactions");
    xhr.setRequestHeader("X-API-KEY", process.env.DRAGONGLASS_KEY);

    xhr.send();
}

leaderboardComponent();
