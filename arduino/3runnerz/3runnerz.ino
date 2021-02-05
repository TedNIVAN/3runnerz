#include <FlashStorage.h>
#include <WebUSB.h>

WebUSB WebUSBSerial(1 /* https:// */, "tednivan.github.io/3runnerz/");

#undef Serial
#define Serial WebUSBSerial

// Reserve a portion of flash memory to store an "int" variables
FlashStorage(accountId, int);
FlashStorage(distance, int);

int accId = 1;
int dist = 0;

char message[30];

void setup() {
  //SERIAL_PORT_MONITOR.begin(9600);
  while (!Serial) {
    ;
  }

  Serial.begin(9600);
  Serial.flush();
}

void loop() {

  if (Serial && Serial.available()) {
    int Msg = Serial.read();

    if (Msg == 255) {
      dist = distance.read();
      accId = accountId.read();
      String msg1 = "{\"account\": \"0.0.";
      String msg2 = msg1 + accId;
      String msg3 = msg2 + "\", \"distance\":";
      String msg4 = msg3 + dist;
      String msg5 = msg4 + "}";
      msg5.toCharArray(message, 64);
      Serial.write(message, msg5.length());
    } else {
      //accId = stringMsg.toInt();
      accountId.write(Msg);
    }
    Serial.flush();
  }

  distance.write(dist);
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
  delay(200);
}
