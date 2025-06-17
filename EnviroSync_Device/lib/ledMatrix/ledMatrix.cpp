//
// Created by Nikolaj on 13-06-2025.
//

#include "ledMatrix.h"

const uint32_t happy[] = {
    0x19819,
    0x80000001,
    0x81f8000
};

void ledMatrix::setup(){
    matrix.begin();
}

void ledMatrix::loadPixel(){
    matrix.loadFrame(happy);
}
