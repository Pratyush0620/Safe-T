#pragma once

extern float temperatureC;
extern int32_t averageHeartRate;
extern int32_t spo2;
extern long lastIRValue; 

inline void printSketch(void * parameter) {
    for (;;) {
      
        Serial.print("IR=");
        Serial.print(lastIRValue);
        Serial.print(" BPM=");
        Serial.print(averageHeartRate);
        Serial.print(", TempC=");
        Serial.print(temperatureC, 2);
        Serial.print(", SPO2=");
        Serial.println(spo2);
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
}