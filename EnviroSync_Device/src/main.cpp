#include <WiFiConnect.h>
#include <Clock.h>
#include <ArduinoJson.h>
#include <uploadToServer.h>
#include <sensor.h>
#include <ledMatrix.h>

WiFiConnect wifi;
Clock Clock;
sensor sensor;
uploadToServer uploadToServer;
ledMatrix matrix;

void setup() {
    Serial.begin(9600);
    matrix.setup();
    wifi.autoConnect();
    Clock.startNTP();
    sensor.startSensor();
    JsonDocument doc;
    doc["serial_number"] = wifi.serialNumber;
    String jsonOutput;
    serializeJson(doc, jsonOutput);
    uploadToServer.uploadToAPI("/sensor/register", jsonOutput.c_str());
}

void loop() {
    Clock.updateNTP();

    if (Clock.timeToSendData())
    {
        JsonDocument doc;
        doc["serial_number"] = wifi.serialNumber;
        doc["temp"] = sensor.getTemp();
        doc["humidity"] = sensor.getHumidity();
        doc["co2"] = sensor.getPressure();
        doc["tvoc"] = sensor.getTVOC();

        String jsonOutput;
        serializeJson(doc, jsonOutput);

        Serial.println(jsonOutput);
        uploadToServer.uploadToAPI("/sensor/data/new",jsonOutput.c_str());
    }

    if (Clock.timeToSendStatus())
    {
        //den er stat til at køre den her en gang i timen
    }
}