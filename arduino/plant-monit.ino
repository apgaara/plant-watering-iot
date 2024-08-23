require('dotenv').config(); 
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

int air; // Variable for soil moisture sensor
const char* ssid = process.env.WIFI_SSID; // Replace with your WiFi SSID
const char* password = process.env.WIFI_PASSWORD; // Replace with your WiFi password
const apiUrl = process.env.API_URL;

WiFiClient wifiClient; // Create a WiFiClient object

void setup() {
  Serial.begin(115200);

  // Initialize pins (adjust pin numbers for ESP8266)
  pinMode(D1, OUTPUT); // Relay pin
  pinMode(D2, INPUT);  // Soil moisture sensor pin

  // Connect to WiFi
  connectToWiFi();
}

void loop() {
  air = digitalRead(D2); // Read soil moisture

  // Control the pump based on soil moisture
  if (air == HIGH) {
    digitalWrite(D1, LOW); // Stop the pump if soil is wet
  } else {
    digitalWrite(D1, HIGH); // Start the pump if soil is dry
  }

  // Send data to the server
  sendDataToServer(air);

  // Add a delay for the next reading
  delay(10000); // Adjust the delay as needed
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("Connected to WiFi!");
}

void sendDataToServer(int soilMoisture) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(wifiClient, apiUrl); // Use the WiFiClient object

    // Create JSON payload
    String jsonPayload = "{\"soilMoisture\":" + String(soilMoisture) + "}";

    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode); // Print response code
      Serial.println(response); // Print response
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
}
