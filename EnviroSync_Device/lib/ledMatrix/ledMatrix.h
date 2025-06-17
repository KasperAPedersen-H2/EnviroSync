//
// Created by Nikolaj on 13-06-2025.
//

#ifndef LEDMATRIX_H
#define LEDMATRIX_H
#include <Arduino.h>
#include "Arduino_LED_Matrix.h"


class ledMatrix {
    public:
    void setup();

    void loadPixel();

    private:
    ArduinoLEDMatrix matrix;






};





#endif //LEDMATRIX_H
