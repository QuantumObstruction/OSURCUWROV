 
 
 
 /*
  ESC_Ramp
    Based on the Sweep example in the Servo library, this allow a ramp up and down of the ESC speed based on the Min and Max values.
    The Min and Max speed are defined so you can change them at one location and it will be used in the ramp as well.

  27 April 2017
  by Eric Nantel
 */
#include <Wire.h>
#include "ESC.h"
#define LED_PIN (13)                                      // Pin for the LED
#define SPEED_MIN (1000)                                  // Set the Minimum Speed in microseconds
#define SPEED_MAX (2000)                                  // Set the Minimum Speed in microseconds

ESC myESC1 (2, SPEED_MIN, SPEED_MAX, 500);                 // ESC_Name (ESC PIN, Minimum Value, Maximum Value, Default Speed, Arm Value)
ESC myESC2 (3, SPEED_MIN, SPEED_MAX, 500);
ESC myESC3 (4, SPEED_MIN, SPEED_MAX, 500);
ESC myESC4 (5, SPEED_MIN, SPEED_MAX, 500);
// ESC myESC5 (6, SPEED_MIN, SPEED_MAX, 500);
ESC myESC6 (7, SPEED_MIN, SPEED_MAX, 500);
ESC myESC7 (8, SPEED_MIN, SPEED_MAX, 500);
int oESC;                                                 // Variable for the speed sent to the ESC

void setup() {
  Wire.begin(8);                // join i2c bus with address #8
  Wire.onReceive(receiveEvent); // register event
  Serial.begin(9600);           // start serial for output
  pinMode(LED_PIN, OUTPUT);                               // LED Visual Output
  myESC1.arm();                                            // Send the Arm value so the ESC will be ready to take commands
  myESC2.arm();
  myESC3.arm();
  myESC4.arm();
 // myESC5.arm();
  myESC6.arm();
  myESC7.arm();
   for(int i = 0; i < 5; i++){
   digitalWrite(LED_PIN, HIGH);
    delay(1000);
    digitalWrite(LED_PIN, LOW);
   }
                            
 }


void loop() {
 
  
}


//  void motorSpin(int spinney){
//  int chill = 1500;;
//  oESC = map(spinney,255,0,1000,2000);
// 
//    digitalWrite(LED_PIN, HIGH);
//    myESC1.speed(oESC);                                    // tell ESC to go to the oESC speed value
//    myESC2.speed(oESC);
//    myESC3.speed(oESC);
//    myESC4.speed(oESC);
//    //myESC5.speed(oESC);
//    myESC6.speed(oESC);
//    myESC7.speed(oESC);                                            // waits 10ms for the ESC to reach speed
//    Serial.println("Finishid Thrustifying!!!");
//  }
  
void receiveEvent(int howMany) {
  byte c[7];
  while (1 < Wire.available()) { // loop through all but the last
    for (int i = 0; i < howMany; i++) {
     c[i] = Wire.read(); // receive byte as a character
    }    
    //Serial.print("c[");Serial.print("0");Serial.print("]: ");Serial.println(c[0]);         // print the character
      digitalWrite(LED_PIN, HIGH);
        
  oESC = map(c[0],255,0,1000,2000);  
   Serial.print("oESC value: ");
   Serial.println(oESC); 
    myESC1.speed(oESC);                                    // tell ESC to go to the oESC speed value
    myESC2.speed(oESC);
    myESC3.speed(oESC);
    myESC4.speed(oESC);
    //myESC5.speed(oESC);
    myESC6.speed(oESC);
    myESC7.speed(oESC);                                            // waits 10ms for the ESC to reach speed
    
    Serial.println("Finishid Thrustifying!!!");
    //}
  }
  Serial.println("receive event finished");
 
 }

