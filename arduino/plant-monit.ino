#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

int air; // Variable for soil moisture sensor
int soilMoisturePercentage; // Variable for soil moisture percentage
bool pumpStatus = false; // Track pump status
bool previousPumpStatus = false; // Track previous pump status
const char* ssid = "Indomie"; // Replace with your WiFi SSID
const char* password = "01202829"; // Replace with your WiFi password

WiFiClient wifiClient; // Create a WiFiClient object

void setup() {
  Serial.begin(115200);

  // Initialize pins (adjust pin numbers for ESP8266)
  pinMode(D1, OUTPUT); // Relay pin
  pinMode(A0, INPUT);  // Soil moisture sensor pin

  // Connect to WiFi
  connectToWiFi();
}

void loop() {
  air = analogRead(A0); // Read soil moisture
  soilMoisturePercentage = map(air, 1023, 0, 0, 100); // Convert to percentage

  // Control the pump based on soil moisture with hysteresis
  if (soilMoisturePercentage < 25 && !pumpStatus) {  // Soil is dry (less than 25%)
    pumpStatus = true;
    digitalWrite(D1, LOW); // Start the pump if soil is dry
    Serial.println("Soil is dry, pump ON");
  } else if (soilMoisturePercentage > 35 && pumpStatus) { // Soil is wet (more than 35%)
    pumpStatus = false;
    digitalWrite(D1, HIGH); // Stop the pump if soil is wet
    Serial.println("Soil is wet, pump OFF");
  }

  // Only send data to the server if the pump status changes
  if (pumpStatus != previousPumpStatus) {
    sendDataToServer(soilMoisturePercentage);
    previousPumpStatus = pumpStatus;
  }

  // Check for pump status from the server
  checkPumpStatus();

  // Add a short delay to avoid rapid loop execution
  delay(50); // 100 milliseconds delay
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
    http.begin(wifiClient, "http://47.250.179.166/api/data"); // Use the WiFiClient object

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

void checkPumpStatus() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(wifiClient, "http://47.250.179.166/api/pump-status"); // Use the WiFiClient object

    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      String response = http.getString();
      bool serverPumpStatus = response == "1"; // Assume server sends "1" for ON, "0" for OFF

      // Update pump status only if different
      if (serverPumpStatus != pumpStatus) {
        pumpStatus = serverPumpStatus;
        digitalWrite(D1, pumpStatus ? LOW : HIGH);
      }
    } else {
      Serial.print("Error on getting pump status: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
}
