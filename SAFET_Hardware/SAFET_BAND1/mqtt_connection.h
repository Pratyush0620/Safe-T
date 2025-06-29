#pragma once

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <math.h>

// WiFi and MQTT configuration:
#define WIFI_SSID ""
#define WIFI_PASSWORD ""
#define MQTT_SERVER "Enter your own mqtt broker"
#define MQTT_PORT 1883
#define STATUS_TOPIC "SAFET/band1/status"
#define VITALS_TOPIC "SAFET/band1/vitals"
#define ALL_DATA_TOPIC "SAFET/band1/all_data"


extern String ledColor;  
extern bool sosActive;   
//extern int beatAvg;
extern int32_t spo2;
extern int32_t averageHeartRate;
extern float temperatureC;

WiFiClient espClient;
PubSubClient client(espClient);

void mqttCallback(char* topic, byte* payload, unsigned int length) {
    char message[length + 1];
    memcpy(message, payload, length);
    message[length] = '\0';
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("]: ");
    Serial.println(message);

    
    if (strcmp(topic, "SAFET/band1/ack") == 0) {
        DynamicJsonDocument ackDoc(128);
        DeserializationError err = deserializeJson(ackDoc, message);
        if (!err && ackDoc["response"].is<bool>() && ackDoc["response"].as<bool>() == true) {
            Serial.println("Server acknowledged your message (response: true).");
        } else {
            Serial.println("Received ack message without valid response.");
        }
        return;
    }

    DynamicJsonDocument doc(200);
    DeserializationError error = deserializeJson(doc, message);
    if (!error) {
        if (doc["status"].is<int>()) {
            int status = doc["status"];
            ledColor = String(status);
        }
    } else {
        Serial.println("Failed to parse MQTT message");
    }
}

bool reconnect() {
    if (client.connect("band1")) {
        client.subscribe(STATUS_TOPIC);
        client.subscribe("SAFET/band1/ack"); 
    } else {
        Serial.print("Failed, rc=");
        Serial.print(client.state());
        Serial.println(" Retrying in 2 seconds...");
        delay(2000);
        return false;
    }
    return client.connected();
}

void mqttSketch(void * parameter) {
    vTaskDelay(500 / portTICK_PERIOD_MS);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        vTaskDelay(300 / portTICK_PERIOD_MS);
    }
    Serial.println("\nWiFi connected");

    client.setServer(MQTT_SERVER, MQTT_PORT);
    client.setCallback(mqttCallback);

    while (!client.connected()) {
        reconnect();
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
    Serial.println("MQTT connected");

    // --- VITALS PUBLISHING (to AI server) ---
    const unsigned long heartbeatInterval = 10000;
    unsigned long lastPublishedTime = millis();
    const int bpmThreshold = 2;       // 2 BPM difference.
    const int spo2Threshold = 1;        // 1% difference.
    const float tempThreshold = 0.1;    // 0.1°C difference.

    int lastPublishedBPM = averageHeartRate;
    int lastPublishedSPO2 = spo2;
    float lastPublishedTemp = temperatureC;

    // --- ALL DATA PUBLISHING (to backend server) ---
    const unsigned long allDataInterval = 10000;
    unsigned long lastAllDataPublishedTime = millis();
    String lastPublishedLed = ledColor;
    bool lastPublishedSos = sosActive;

    const unsigned long activeReportInterval = 10000; // Adjust as needed.
    unsigned long lastActiveReportTime = millis();

    for (;;) {
        client.loop();
        unsigned long now = millis();
        
        if (now - lastActiveReportTime >= activeReportInterval) {
        lastActiveReportTime = now;
        DynamicJsonDocument activeDoc(128);
        activeDoc["is_active"] = true;
        activeDoc["timestamp"] = now;
        char activeBuffer[128];
        size_t activeSize = serializeJson(activeDoc, activeBuffer);
        client.publish("SAFET/band1/is_active", activeBuffer, activeSize);
        }

        bool vitalsChanged = (abs(averageHeartRate - lastPublishedBPM) >= bpmThreshold) ||
                             (abs(spo2 - lastPublishedSPO2) >= spo2Threshold) ||
                             (fabs(temperatureC - lastPublishedTemp) >= tempThreshold);
        
        if (vitalsChanged || (now - lastPublishedTime >= heartbeatInterval)) {
            lastPublishedTime = now;
            lastPublishedBPM = averageHeartRate;
            lastPublishedSPO2 = spo2;
            lastPublishedTemp = temperatureC;

            DynamicJsonDocument doc(256);
            doc["heart_rate"] = averageHeartRate;
            doc["spo2"] = spo2;
            doc["bodyTemp"] = ((int)(temperatureC * 100 + 0.5)) / 100.0;
            
            char buffer[256];
            size_t n = serializeJson(doc, buffer);
            client.publish(VITALS_TOPIC, buffer, n);
        }

        bool allDataChanged = vitalsChanged ||
                              (ledColor != lastPublishedLed) ||
                              (sosActive != lastPublishedSos);
        
        if (allDataChanged || (now - lastAllDataPublishedTime >= allDataInterval)) {
            lastAllDataPublishedTime = now;
            lastPublishedLed = ledColor;
            lastPublishedSos = sosActive;
            
            DynamicJsonDocument doc(256);
            doc["heart_rate"] = averageHeartRate;
            doc["spo2"] = spo2;
            doc["bodyTemp"] = ((int)(temperatureC * 100 + 0.5)) / 100.0;
            doc["led_status"] = ledColor;
            doc["sos"] = sosActive;

            char buffer[256];
            size_t n = serializeJson(doc, buffer);
            client.publish(ALL_DATA_TOPIC, buffer, n);
        }
        
        vTaskDelay(200 / portTICK_PERIOD_MS);
    }
}