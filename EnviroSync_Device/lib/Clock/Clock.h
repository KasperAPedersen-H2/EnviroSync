//
// Created by Nikolaj on 14-05-2025.
//

#ifndef CLOCK_H
#define CLOCK_H
#include <WiFiUDP.h>
#include <NTPClient.h>

constexpr const char* kNtpServer = "pool.ntp.org";
constexpr long kTimeOffsetSeconds = 3600;
constexpr unsigned long kUpdateIntervalMs = 60000;

class Clock {
    public:
        void startNTP();

        void updateNTP();

        bool timeToSendData();

        bool timeToSendStatus();

    private:
        WiFiUDP ntpUDP;
        NTPClient ntpClient{ntpUDP, kNtpServer, kTimeOffsetSeconds, kUpdateIntervalMs};
        unsigned long lastSendTime = 0;
        unsigned long currentTime = 0;
        int lastHour = -1;
};

#endif //CLOCK_H
