import { serial } from './serial'
import { CountUp } from 'countup.js';
import { sendTransaction } from './transaction'

let myData;
var runners = ["001-soccer-player.png", "003-runner.png", "008-runner-1.png", "010-gymnast.png", "015-muay-thai.png", "016-volleyball-player.png", "021-water-polo-1.png", "033-wrestler-1.png", "046-volleyball.png"];
var port;

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
    port.disconnect().catch(error => {
      console.log('Send error: ' + error);
    });
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

function deviceComponent() {
  'use strict';

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector('#connect');

    var mdl = new BulmaModal("#performanceModal");

    mdl.addEventListener('modal:show', function () {
      console.log("opened")
    })

    mdl.addEventListener("modal:close", function () {
      console.log("closed")
    })

    function connect() {
      console.log('Connecting to ' + port.device_.productName + '...');
      port.connect().then(() => {
        console.log(port);
        console.log('Connected.');
        connectButton.innerHTML = `<span class="icon is-medium">
        <i class="fa fa-usb"></i>
      </span>
      <span>Disconnect Device</span>`;
        mdl.show();

        let textEncoder = new TextEncoder();
        let str = "H";
        port.send(textEncoder.encode(str)).catch(error => {
          console.log('Send error: ' + error);
        });

        port.onReceive = data => {
          let textDecoder = new TextDecoder();
          let decoded = textDecoder.decode(data);
          console.log(decoded);
          try {
            myData = JSON.parse(`${decoded}`);
            console.log(myData);
            try {
              fetchRunner(myData.account, myData.distance);
              document.getElementById("submit").disabled = false;
            } catch (err) {
              console.log(err);
            }
            //document.getElementById("pergrid").innerHTML = `${myData.account}, ${myData.distance}`
          }
          catch (err) {
            // the JSON.parse call failed, handle the error appropriately
            console.log(err);
          }
          //console.log(myData);
        }
        port.onReceiveError = error => {
          console.log('Receive error: ' + error);
        };
      }, error => {
        console.log('Connection error: ' + error);
      });
    };

    document.getElementById("submit").addEventListener('click', () => {
      document.getElementById("submit").classList.add("is-loading");
      var memo = `{accountId":"${myData.account}","distance":${myData.distance}}`
      var amount = myData.distance;
      sendTransaction(myData.account, memo, amount);
    });

    connectButton.addEventListener('click', function () {
      if (port) {
        port.disconnect();
        connectButton.innerHTML = `<span class="icon is-medium">
          <i class="fa fa-usb"></i>
        </span>
        <span>Connect Device</span>`;
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
}

function requestData(str) {
  console.log("tty");
  if (port !== undefined) {
    console.log("yaz");
    let textEncoder = new TextEncoder();
    port.send(textEncoder.encode(str)).catch(error => {
      console.log('Send error: ' + error);
    });
  }
}

function fetchRunner(accountId, distance) {
  var xhr = new XMLHttpRequest();
  var runnerz = [];

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      var res = JSON.parse(this.responseText);

      res.data.forEach(e => {
        try {
          var memo = JSON.parse(`${e.memo}`);
          if (validate(memo)) {
            console.log(1);
            runnerz.push(memo);
            console.log(runnerz);
            if (memo.accountId === accountId) {
              console.log("memo");
              console.log(memo);
              document.getElementById("perfgrid").innerHTML = `
              <div class="column animate__animated animate__flip">
              <figure class="image is-128x128">
                <img src="${runners[memo.avatar]}" alt="">
              </figure>
              <br>
              <strong><span class="tag is-light is-rounded is-medium"><span style="padding-right: 5px;">${memo.fullname}</span><span class="flag-icon flag-icon-${memo.country}"></span></span></strong>
              <br>
              <br>
              <strong><span class="tag is-light is-large" style="width: 130px">distance (m)</span></strong>
                <br>
                <strong><span class="tag is-primary is-large" id="targetId" style="width: 130px">
                <i class="fas fa-circle-notch fa-spin"></i>
                </span></strong>
            </div>`;
            }

            setTimeout(() => {
              const countUp = new CountUp('targetId', distance, { duration: 4 });
              if (!countUp.error) {
                countUp.start();
                document.getElementById('targetId').innerHTML += "m";
              } else {
                console.error(countUp.error);
              }
            }, 1500);

          }
        } catch (err) {
          console.log(err);
        }
      });
    }
  });

  xhr.open("GET", "https://api-testnet.dragonglass.me/hedera/api/accounts/0.0.221495/transactions");
  xhr.setRequestHeader("X-API-KEY", process.env.DRAGONGLASS_KEY);

  xhr.send();
}

deviceComponent();