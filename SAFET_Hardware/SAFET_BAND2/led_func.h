#pragma once

#include <WiFi.h>
#include <PubSubClient.h>

const int redPin = 23;
const int greenPin = 18;
const int bluePin = 19;

extern bool sosActive;
extern String ledColor;
extern PubSubClient client;  

void controlLED(String color) {
    if (!sosActive) {
        if (color == "2") {
            digitalWrite(redPin, HIGH);
            digitalWrite(greenPin, LOW);
            digitalWrite(bluePin, LOW);
        } else if (color == "0") {
            digitalWrite(redPin, LOW);
            digitalWrite(greenPin, HIGH);
            digitalWrite(bluePin, LOW);
        } else if (color == "1") {
            digitalWrite(redPin, LOW);
            digitalWrite(greenPin, LOW);
            digitalWrite(bluePin, HIGH);
        } else {
            digitalWrite(redPin, LOW);
            digitalWrite(greenPin, LOW);
            digitalWrite(bluePin, LOW);
        }
    }
}

void blinkRedLED() {
    static unsigned long previousMillis = 0;
    const int interval = 50;
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;
        int state = digitalRead(redPin);
        digitalWrite(redPin, !state);
        digitalWrite(greenPin, LOW);
        digitalWrite(bluePin, LOW);
    }
}

// New: blinkBlueLED to use during connection failures.
void blinkBlueLED() {
    static unsigned long previousMillis = 0;
    const int interval = 10; // 1 second delay toggle
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;
        int state = digitalRead(bluePin);
        digitalWrite(bluePin, !state);
        digitalWrite(redPin, LOW);
        digitalWrite(greenPin, LOW);
    }
}

void blinkGreenLED() {
    static unsigned long previousMillis = 0;
    const int interval = 10; // Adjust as needed for desired blink rate
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;
        int state = digitalRead(greenPin);
        digitalWrite(greenPin, !state);
        digitalWrite(redPin, LOW);
        digitalWrite(bluePin, LOW);
    }
}

void ledSketch(void * parameter) {
    pinMode(redPin, OUTPUT);
    pinMode(greenPin, OUTPUT);
    pinMode(bluePin, OUTPUT);
    digitalWrite(redPin, LOW);
    digitalWrite(greenPin, LOW);
    digitalWrite(bluePin, LOW);

    for (;;) {
        // Check if WiFi and MQTT are connected:
        if (WiFi.status() != WL_CONNECTED) {
            // Blink blue LED every 1 second until connection is established
            blinkBlueLED();
        } 
        else if (!client.connected()) {
            // Blink green LED if MQTT is not connected
            blinkGreenLED();
        } else {
            // When connected: if SOS active, blink red LED, otherwise control LED normally.
            if (sosActive) {
                blinkRedLED();
            } else {
                controlLED(ledColor);
            }
        }
        vTaskDelay(200 / portTICK_PERIOD_MS);
    }
}