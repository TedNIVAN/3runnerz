import { BulmaModal } from './modal'

function prizesComponent() {
    console.log("aaaaaa");
    var mdl = new BulmaModal("#myModal")

    document.querySelectorAll('.nft').forEach(item => {
 
        item.addEventListener('click', event => {
            mdl.show()
    
            console.log(item.getAttribute("id"));

            var id = item.getAttribute("id");
            var title;

            if(id === "gRUNz"){
                title = "Gold Medal (gRUNz)"
            } else if(id === "sRUNz"){
                title = "Silver Medal (sRUNz)"
            } else{
                title = "Bronze Medal (bRUNz)"
            }

            document.getElementById("nfttitle").innerHTML = title;

            document.getElementById("nftgrid").innerHTML = "";

            for(var i=0; i < 10; i++){
                document.getElementById("nftgrid").innerHTML +=
                `
                <div class="column is-4">
                <img src="${id}.png" alt="" width="50%"> 
                <br>
                <a target="_blank" href="https://explorer.kabuto.sh/testnet">more info.</a>
                </div>
                `;
            }

             /*
            let name = item.getAttribute("name");
            console.log(name);
            document.getElementsByClassName("modal-card-title")[0].innerText = name;
            let image = item.getAttribute("data-img");
            console.log(image);
            document.getElementById("fimg").src = image;
            let price = item.getAttribute("data-price");
            amountToPay = Number.parseFloat(price / ethPrice).toPrecision(2);
            document.getElementById("fruit-price").innerText = 'COST $' + price + ' - PAY ' + amountToPay + ' ETH';
            */
        })
    })

    mdl.addEventListener('modal:show', function () {
        console.log("opened")
    })

    mdl.addEventListener("modal:close", function () {
        console.log("closed")
    })
    
}

prizesComponent();


