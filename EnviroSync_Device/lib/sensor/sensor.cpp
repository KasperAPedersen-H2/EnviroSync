//
// Created by Nikolaj on 14-05-2025.
//

#include "sensor.h"
DFRobot_ENS160_I2C airQualitySensor(&Wire, 0x53);
Adafruit_AHTX0 aht;

void sensor::startSensor()
{
    Wire.begin();
    delay(100);
    if (airQualitySensor.begin() != 0){
        Serial.println("ENS160 sensor can't be installed!");
        while (1);
    }

    if (!aht.begin()){
        Serial.println("AHTX0 sensor can't be installed!");
        while (1);
    }

    Serial.println("Sensor started!");
}

int sensor::getTemp(){
    sensors_event_t humidity, temp;
    aht.getEvent(&humidity ,&temp);
    return temp.temperature;
}

int sensor::getHumidity(){
    sensors_event_t humidity, temp;
    aht.getEvent(&humidity ,&temp);
    return humidity.relative_humidity;
}

int sensor::getPressure(){
    return airQualitySensor.getECO2();
}

int sensor::getTVOC(){
    return airQualitySensor.getTVOC();
}

