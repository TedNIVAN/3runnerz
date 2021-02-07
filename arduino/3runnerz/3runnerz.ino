//#include <FlashStorage.h>
#include <WebUSB.h>

WebUSB WebUSBSerial(1 /* https:// */, "tednivan.github.io/3runnerz/");

#undef Serial
#define Serial WebUSBSerial

// Reserve a portion of flash memory to store an "int" variables
//FlashStorage(accountId, int);
//FlashStorage(distance, int);

int accId = 1;
int dist = 0;

char message[30];

int data[5];
int dataIndex = 0;

int abc;

uint8_t irCode[4] = {1, 6, 4, 3};

void writeWebUSB(const uint8_t *buffer, int size) {
  WebUSBSerial.write((const uint8_t *)buffer, size);
  WebUSBSerial.flush();
}

void setup() {
  //SERIAL_PORT_MONITOR.begin(9600);
  while (!Serial) {
    ;
  }

  Serial.begin(9600);
  Serial.flush();
}

void loop() {
  WebUSBSerial.write("0.0.221495");
  WebUSBSerial.flush();

 if (Serial && Serial.available()) {

            String str=Serial.readString();
            WebUSBSerial.write(str);
            
    /*
        if (data[dataIndex] == 255) {
          //dist = distance.read();
          //accId = accountId.read();
          String chunk1 = "{\"account\": \"0.0.";
          String chunk2 = chunk1 + accId;
          String chunk3 = chunk2 + "\", \"distance\":";
          String chunk4 = chunk3 + dist;
          String msg = chunk4 + "}";
          msg.toCharArray(message, 64);
          Serial.write(message, msg.length());
          dataIndex = 0;
        } else {
          //accId = stringMsg.toInt();
          //accountId.write(data);
        }
    */
    Serial.flush();
  }

  //distance.write(dist);
  /*
    dist = distance.read();
    accId = accountId.read();
    String msg1 = "{\"account\": \"0.0.";
    String msg2 = msg1 + accId;
    String msg3 = msg2 + "\", \"distance\":";
    String msg4 = msg3 + dist;
    String msg5 = msg4 + "}";
    msg5.toCharArray(message, 64);
    Serial.write(message, msg5.length());
  */
  delay(400);
}
