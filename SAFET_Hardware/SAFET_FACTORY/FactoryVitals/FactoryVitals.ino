#include <Arduino.h>
#include <DHT.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// WiFi & MQTT Settings
const char* ssid = "";
const char* password = "";
const char* mqtt_server = "Enter your own mqtt broker"; 
const char* mqtt_username = ""; 
const char* mqtt_password = "";

WiFiClient espClient;
PubSubClient client(espClient);

// Pin Definitions
#define MQ135_PIN A0      // MQ135 connected to ADC0 (A0)
#define DHT_PIN 2         // DHT11 connected to GPIO2 (D4)
#define DHT_TYPE DHT11

// MQ-135 Constants
const float RL = 10.0;           // Load resistance in kΩ
const float Ro = 76.63;          // Sensor resistance in fresh air (calibrated)
const int ADC_MAX = 1023;        // ADC resolution
const float ADC_REF_VOLTAGE = 3.3; // ADC reference voltage

// DHT11 Sensor Object
DHT dht(DHT_PIN, DHT_TYPE);

void setup_wifi() {
  WiFi.mode(WIFI_STA);
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.print("WiFi connected with IP: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect (client ID can be adjusted)
    if (client.connect("FactoryVitalsClient",mqtt_username,mqtt_password)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Read Temperature & Humidity first for compensation
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    delay(2000);
    return;
  }
  
  // Read MQ-135 Sensor Data
  int rawValue = analogRead(MQ135_PIN);
  float voltage = (rawValue / (float)ADC_MAX) * ADC_REF_VOLTAGE;
  
  if (voltage <= 0) {
    Serial.println("Invalid voltage reading!");
    delay(2000);
    return;
  }
  
  // Sensor resistance calculation
  float resistance = ((ADC_REF_VOLTAGE - voltage) / voltage) * RL;
  if (resistance <= 0) {
    Serial.println("Invalid resistance calculation!");
    delay(2000);
    return;
  }
  
  // Normalize Rs/Ro
  float ratio = resistance / Ro;
  
  // Temperature compensation: use 25 °C as reference
  float tempRef = 25.0;
  float tempFactor = tempRef / temperature; // if temperature > 25, factor < 1
  
  // Gas concentration calculations using MQ-135 gas curves with compensation
  float ammonia_ppm = 15 * pow(ratio, -1.5) * tempFactor;    // Ammonia (NH3)
  float alcohol_ppm = 12 * pow(ratio, -1.5) * tempFactor;      // Alcohol (C2H5OH)
  float benzene_ppm = 10 * pow(ratio, -1.6) * tempFactor;      // Benzene (C6H6)
  float co2_ppm = 116.602 * pow(ratio, -2.769) * tempFactor;   // CO2
  
  // Ensure CO2 does not drop below atmospheric levels (350 PPM)
  if (co2_ppm < 350) co2_ppm = 350;
  
  // AQI calculation remains unchanged.
  int aqi = 0;
  String airQuality = "Unknown";
  
  if (co2_ppm <= 450) {
    aqi = map(co2_ppm, 350, 450, 0, 50);
    airQuality = "Excellent";
  } else if (co2_ppm <= 1000) {
    aqi = map(co2_ppm, 451, 1000, 51, 100);
    airQuality = "Good";
  } else if (co2_ppm <= 2000) {
    aqi = map(co2_ppm, 1001, 2000, 101, 150);
    airQuality = "Moderate";
  } else if (co2_ppm <= 5000) {
    aqi = map(co2_ppm, 2001, 5000, 151, 200);
    airQuality = "Unhealthy";
  } else {
    aqi = 300;
    airQuality = "Very Bad";
  }
  
  // Print values locally
  Serial.println("----- Air Quality Data -----");
  Serial.print("Raw Analog Value: ");
  Serial.println(rawValue);
  Serial.print("Voltage: ");
  Serial.println(voltage, 2);
  Serial.print("Sensor Resistance: ");
  Serial.println(resistance, 2);
  Serial.print("CO2 PPM: ");
  Serial.println(co2_ppm, 2);
  Serial.print("Ammonia (NH3) PPM: ");
  Serial.println(ammonia_ppm, 2);
  Serial.print("Alcohol (C2H5OH) PPM: ");
  Serial.println(alcohol_ppm, 2);
  Serial.print("Benzene (C6H6) PPM: ");
  Serial.println(benzene_ppm, 2);
  Serial.print("AQI Score: ");
  Serial.println(aqi);
  Serial.print("Air Quality: ");
  Serial.println(airQuality);
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" °C");
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");
  Serial.println("---------------------------\n");


  // Create JSON payload
  String jsonPayload = "{";
  jsonPayload += "\"CO2_PPM\":";
  jsonPayload += String(co2_ppm, 2);
  jsonPayload += ",\"Ammonia_PPM\":";
  jsonPayload += String(ammonia_ppm, 2);
  jsonPayload += ",\"Alcohol_PPM\":";
  jsonPayload += String(alcohol_ppm, 2);
  jsonPayload += ",\"Benzene_PPM\":";
  jsonPayload += String(benzene_ppm, 2);
  jsonPayload += ",\"AQI_Score\":";
  jsonPayload += String(aqi);
  jsonPayload += ",\"Temperature\":";
  jsonPayload += String(temperature, 2);
  jsonPayload += ",\"Humidity\":";
  jsonPayload += String(humidity, 2);
  jsonPayload += "}";

  // Publish JSON payload to the topic "SAFET/factory/vitals"
  if(client.publish("SAFET/factory/vitals", jsonPayload.c_str())){
    Serial.println("JSON data published successfully.");
  } else {
    Serial.println("Failed to publish JSON data.");
  }
  
  delay(10000); // Wait for 2 seconds before next reading
}