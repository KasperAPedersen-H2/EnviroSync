//
// Created by Nikolaj on 14-05-2025.
//

#ifndef SENSOR_H
#define SENSOR_H
#include <Wire.h>
#include <DFRobot_ENS160.h>
#include <Adafruit_AHTX0.h>

class sensor {
    public:
        void startSensor();

        int getTemp();

        int getHumidity();

        int getPressure();

        int getTVOC();

    private:

};



#endif //SENSOR_H
