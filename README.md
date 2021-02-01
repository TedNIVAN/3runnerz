# 3runnerz
3Runnerz is a blockchain-based running application based on [Hedera Hashgraph](https://hedera.com/).

## Getting Started | Software

![3Runnerz](https://github.com/TedNIVAN/3runnerz/blob/master/3runnerz.png)

**Here you will see how to run the app locally.**

1. Clone the fruity market repository.
```
git clone https://github.com/TedNIVAN/3runnerz.git
```

2. Initialize the project.
```
cd 3runnerz
npm i
```

3. Set your keys in `src/.env_sample` 

4. Rename `src/.env_sample` to `src/.env`

5. Build the project.
```
npm run dev
```

**App should be running at: http://localhost:2000**

## Getting Started | Hardware

![Device](https://github.com/TedNIVAN/3runnerz/blob/master/device.png)

The hardware is made of a **microcontroller (MCU)** and a **3-axis accelerometer (ADXL 335)**. <br />
Here the **Adafruit Feather M0 Express** is used but you could use any popular MCU on the market as long as it has WebUSB support to enable USB transfer via the web navigator ([see here](https://github.com/webusb/arduino#compatible-hardware)).

The source code is available under the arduino folder. Make sure to adapt the code regarding the MCU you use. Note that you will need to install the **Arduino IDE** to program the MCU ([follow the guide here](https://www.arduino.cc/en/Guide)).