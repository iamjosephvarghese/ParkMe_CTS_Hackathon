#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#define in 5

const char* ssid = "DTO_GARAGE";
const char* password = "abcde12345";


void setup () {
 
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  pinMode(in, INPUT);
  
  while (WiFi.status() != WL_CONNECTED) {
 
    delay(1000);
    Serial.print("Connecting..");
 
  }
  Serial.println("I am here...!!");
 
}
 
void loop() {
 
  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
 
    HTTPClient http;  //Declare an object of class HTTPClient

    if(digitalRead(in)==HIGH){
      Serial.write("Car in.....");
      http.begin("http://fathomless-oasis-39946.herokuapp.com/carin");
    }

    if(digitalRead(in)==LOW){
      Serial.write("Car out.....");
      http.begin("http://fathomless-oasis-39946.herokuapp.com/carout");
    }
    
    //http.begin("http://fathomless-oasis-39946.herokuapp.com/carout");  //Specify request destination


    
    int httpCode = http.GET();  
    Serial.println("Data is printing - 3");//Send the request
      String payload1 = http.getString();   //Get the request response payload
      Serial.println(payload1);
    if (httpCode > 0) { //Check the returning code
 
      String payload = http.getString();   //Get the request response payload
      Serial.println(payload);                     //Print the response payload
      Serial.println("Data is printing - 1");
 
    }
 
    http.end();   //Close connection
 
  }
 
  delay(1000);    //Send a request every 30 seconds
  Serial.println("Data is printing");
 
}
