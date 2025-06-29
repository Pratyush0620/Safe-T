#include "touch_button.h"
#include "mqtt_connection.h"   
#include "led_func.h"
//#include "heart_rate.h"
#include "print_data.h"
#include "spo2.h"

bool sosActive = false;
String ledColor = "";



void setup()
{
    Serial.begin(115200);
    xTaskCreatePinnedToCore(touchSketch, "Touch Task", 4096, NULL, 1, NULL, 1);
    xTaskCreatePinnedToCore(mqttSketch, "MQTT Task", 8192, NULL, 1, NULL, 1);
    xTaskCreatePinnedToCore(ledSketch, "LED Task", 4096, NULL, 1, NULL, 1);
    //xTaskCreatePinnedToCore(bpmSketch, "BPM Task", 8192, NULL, 3, NULL, 1);
    xTaskCreatePinnedToCore(printSketch, "Print Task", 4096, NULL, 1, NULL, 1);
    xTaskCreatePinnedToCore(spo2Sketch, "Spo2 Task", 8192, NULL, 3, NULL, 1);
}

void loop()
{
}