import { BulmaModal } from './modal'

function prizesComponent() {
    var mdl = new BulmaModal("#myModal")

    document.querySelectorAll('.nft').forEach(item => {
 
        item.addEventListener('click', event => {
            mdl.show()
    
            console.log(item.getAttribute("id"));

            var id = item.getAttribute("id");
            var title;
            var tokenId = [];

            if(id === "gRUNz"){
                title = "Gold Medal (gRUNz)"
                tokenId = ["0.0.303601","0.0.303604","0.0.303615","0.0.303617","0.0.303618","0.0.303619","0.0.303620","0.0.303621","0.0.303622","0.0.303626"];
            } else if(id === "sRUNz"){
                title = "Silver Medal (sRUNz)"
                tokenId = ["0.0.303691","0.0.303693","0.0.303694","0.0.303695","0.0.303696","0.0.303697","0.0.303698","0.0.303700","0.0.303701","0.0.303702"]
            } else{
                title = "Bronze Medal (bRUNz)"
                tokenId = ["0.0.303665","0.0.303667","0.0.303669","0.0.303670","0.0.303671","0.0.303673","0.0.303672","0.0.303674","0.0.303675","0.0.303676"]
            }

            document.getElementById("nfttitle").innerHTML = title;

            document.getElementById("nftgrid").innerHTML = "";

            for(var i=0; i < 10; i++){
                document.getElementById("nftgrid").innerHTML +=
                `
                <div class="column is-4">
                <img src="${id}.png" alt="" width="50%"> 
                <br>
                <a target="_blank" href="https://explorer.kabuto.sh/testnet/id/${tokenId[i]}">${tokenId[i]}</a>
                </div>
                `;
            }
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


