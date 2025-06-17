//
// Created by Nikolaj on 14-05-2025.
//

#include "Clock.h"

void Clock::startNTP(){
    ntpClient.begin();
}

void Clock::updateNTP(){
    currentTime = ntpClient.getEpochTime();
}

bool Clock::timeToSendData(){
    if (currentTime - lastSendTime >= 300){
        lastSendTime = currentTime;
        return true;
    }
    return false;
}

bool Clock::timeToSendStatus(){
    int hour = ntpClient.getHours();
    int minute = ntpClient.getMinutes();

    if (minute == 0 && hour != lastHour){
        lastHour = hour;
        return true;
    }
    return false;
}

