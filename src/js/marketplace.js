import { BulmaModal } from './modal'
const CoinGecko = require('coingecko-api');

function marketPlaceModalfunction() {
    var mdl = new BulmaModal("#market")

    document.querySelectorAll('.sportItem').forEach(item => {

        item.addEventListener('click', event => {
            mdl.show();

            var id = item.getAttribute("id");

            document.getElementById("fimg").src = `${id}.png`;

            var items = [
                { title: "Running T-shirt", price: 20 },
                { title: "White Jersey", price: 35 },
                { title: "Two-Tone Women Sportswear", price: 140 },
                { title: "Men Running Shoes", price: 120 },
                { title: "Running Short", price: 25 },
                { title: "Yellow Jersey", price: 40 },
                { title: "Pink Women Sportswear", price: 130 },
                { title: "Sport Bra", price: 35 },
                { title: "Women Running Shoes", price: 80 }
            ];

            document.getElementsByClassName("modal-card-title")[0].innerText = items[id].title;

            //2. Initiate the CoinGecko API Client
            const CoinGeckoClient = new CoinGecko();

            //3. Make calls
            var func = async () => {
                let data = await CoinGeckoClient.coins.fetch('hedera-hashgraph', {});
                let price = data.data.market_data.current_price.usd;
                document.getElementById("item-price").innerHTML = `COST ${items[id].price} $ - PAY ${Math.round(items[id].price / price)} ℏ`;
            };

            func();

            let marketPlaceAccount = "0.0.269682";
            document.getElementById("qrcode").innerHTML = ``;
            document.getElementById("address").innerHTML = marketPlaceAccount;
            new QRCode(document.getElementById("qrcode"), {
                text: marketPlaceAccount,
                width: 200,
                height: 200,
            });
        })
    })

    mdl.addEventListener('modal:show', function () {
        console.log("opened")
    })

    mdl.addEventListener("modal:close", function () {
        qrcode.clear();
    })
}

function marketplaceComponent() {
    document.addEventListener('DOMContentLoaded', event => {

        for (var i = 0; i < 10; i++) {
            document.getElementById("itemgrid").innerHTML +=
                `
            <div id="${i}" class="column is-4 hvr-hang sportItem" style="cursor: pointer; padding: 50px">
            <img src="${i}.png" alt="" width="50%"> 
            </div>
            `;
        }
        marketPlaceModalfunction();
    });
}

marketplaceComponent();