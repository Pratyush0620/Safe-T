#ifndef HEART_RATE_H
#define HEART_RATE_H

#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"
#include "spo2_algorithm.h"  // For maxim_heart_rate_and_oxygen_saturation

#define BUFFER_LENGTH 100

// Global variables for heart rate and temperature.
int beatAvg = 0;
float temperatureC = 0;
float beatsPerMinute = 0;
long lastIRValue=0;

// Global variables for SpO2.
uint32_t irBuffer[BUFFER_LENGTH];
uint32_t redBuffer[BUFFER_LENGTH];
int32_t spo2 = 0;
int8_t validSPO2 = 0;
int32_t spo2HeartRate = 0;
int8_t validHeartRate = 0;

void bpmSketch(void * parameter) {
    MAX30105 sensor;
    
    Serial.begin(115200);
    // Serial.println("Initializing sensor for HR and SpO2...");  // Debug output commented out
    
    if (!sensor.begin(Wire, I2C_SPEED_FAST)) {
        // Serial.println("MAX30105 not found. Check wiring/power.");
        for(;;) {
            vTaskDelay(1000 / portTICK_PERIOD_MS);
        }
    }
    sensor.setup();
    sensor.setPulseAmplitudeRed(0x0A);
    sensor.setPulseAmplitudeGreen(0);
    
    // Serial.println("Place your finger on the sensor.");  // Debug output commented out
    
    // Variables for heart rate measurement.
    const byte RATE_SIZE = 10;
    byte rates[RATE_SIZE];
    byte rateSpot = 0;
    long lastBeat = 0;
    unsigned long lastPrintTime = 0;
    const unsigned long printInterval = 5000;
    unsigned long lastTempReadTime = 0;
    float temperatureF = 0;
    // For debug, temporarily lower MIN_BPM to 40 and MIN_DELTA to 200
    const int MIN_BPM = 60;         // Expected minimal BPM for debugging
    const int MAX_BPM = 180;
    const float MAX_BPM_JUMP = 0.06;
    const int STABILIZATION_COUNT = 2;
    int validReadings = 0;
    int lastPrintedBPM = 0;

    // Variable for SpO₂ measurement.
    int sampleIndex = 0;
    
    // Adjusted minimal delta to filter out noise (in ms)
    const long MIN_DELTA = 200;
    
    for (;;) {
        // Wait until a new sample is available.
        while (!sensor.available()) {
            sensor.check();
            vTaskDelay(5 / portTICK_PERIOD_MS);  // Yield to other tasks
        }
        
        long irValue = sensor.getIR();
        lastIRValue=irValue;
        long redValue = sensor.getRed();
        sensor.nextSample(); // Prepare for next sample
        
        // Reset if no finger is detected.
        if (irValue < 70000) { 
            // Serial.println("No finger detected. Resetting HR measurements...");
            beatsPerMinute = 0;
            beatAvg = 0;
            memset(rates, 0, sizeof(rates));
            rateSpot = 0;
            validReadings = 0;
            sampleIndex = 0;
            spo2 = 0;
            validSPO2 = 0;
            // Optional: clear the buffers
            memset(irBuffer, 0, sizeof(irBuffer));
            memset(redBuffer, 0, sizeof(redBuffer));
            vTaskDelay(500 / portTICK_PERIOD_MS); // Longer delay for no-finger state
            continue;
        }
        
        if (checkForBeat(irValue)) {
            long currentTime = millis();
            long delta = currentTime - lastBeat;
            // Only process beat if delta is large enough
            if (delta >= MIN_DELTA) {
                 Serial.println("DEBUG: Beat detected!");
                 Serial.print("DEBUG: delta = ");
                 Serial.println(delta);
                lastBeat = currentTime;  // update only for valid beat
        
                float tempBPM = 60.0 / (delta / 1000.0);
                Serial.print("DEBUG: tempBPM = ");
                 Serial.println(tempBPM, 2);
                if (tempBPM >= MIN_BPM && tempBPM <= MAX_BPM) {
                    if (validReadings > 0) {
                        float bpmDiff = fabs(tempBPM - beatsPerMinute);
                         Serial.print("DEBUG: bpmDiff = ");
                         Serial.println(bpmDiff, 2);
                        if (bpmDiff > (beatsPerMinute * MAX_BPM_JUMP)) {
                             //Apply smoothing filter.
                            beatsPerMinute = (beatsPerMinute * 0.92) + (tempBPM * 0.08);
                             Serial.println("DEBUG: Applied smoothing filter");
                        } else {
                            beatsPerMinute = tempBPM;
                             Serial.println("DEBUG: Assigned tempBPM directly");
                        }
                    } else {
                        beatsPerMinute = tempBPM;
                         Serial.println("DEBUG: First valid BPM reading");
                    }
                    validReadings++;
                     Serial.print("DEBUG: validReadings = ");
                     Serial.println(validReadings);
                    
                    if (validReadings > STABILIZATION_COUNT) {
                        rates[rateSpot++] = (byte)beatsPerMinute;
                        rateSpot %= RATE_SIZE;
                        
                        int sum = 0, count = 0;
                        for (byte x = 0; x < RATE_SIZE; x++) {
                            if (rates[x] > 0) {
                                sum += rates[x];
                                count++;
                            }
                        }
                        beatAvg = (count > 0) ? (sum / count) : beatsPerMinute;
                         Serial.print("DEBUG: beatAvg updated to ");
                         Serial.println(beatAvg);
                    }
                } else {
                     Serial.print("DEBUG: tempBPM out of range: ");
                     Serial.println(tempBPM, 2);
                }
            }
        }
        
        // Collect samples for SpO2 calculation.
        irBuffer[sampleIndex] = irValue;
        redBuffer[sampleIndex] = redValue;
        sampleIndex++;
        if (sampleIndex >= BUFFER_LENGTH) {
            maxim_heart_rate_and_oxygen_saturation(
                irBuffer, 
                BUFFER_LENGTH, 
                redBuffer, 
                &spo2, 
                &validSPO2, 
                &spo2HeartRate, 
                &validHeartRate
            );
            sampleIndex = 0;
        }
        
        // Update temperature every 5 seconds.
        if (millis() - lastTempReadTime >= 5000) {
            temperatureC = sensor.readTemperature();
            temperatureF = sensor.readTemperatureF();
            lastTempReadTime = millis();
        }
        // Ensure SpO2 does not show a default error value.
        if (spo2 == -999 || !validSPO2) {
            spo2 = 0;
        }
        
        // Print debug information periodically.
        if ((millis() - lastPrintTime >= printInterval) || (abs(beatAvg - lastPrintedBPM) >= 3)) {
            lastPrintTime = millis();
            lastPrintedBPM = beatAvg;
            /*
            Serial.print("IR=");
            Serial.print(irValue);
            Serial.print(", BPM=");
            Serial.print(beatsPerMinute, 2);
            Serial.print(", Avg BPM=");
            Serial.print(beatAvg);
            Serial.print(", TempC=");
            Serial.print(temperatureC, 2);
            Serial.print(", SpO2=");
            Serial.print(spo2);
            Serial.println();
            */
        }
        
        // Yield to allow other tasks to run.
        vTaskDelay(1 / portTICK_PERIOD_MS);
    }
}

#endif