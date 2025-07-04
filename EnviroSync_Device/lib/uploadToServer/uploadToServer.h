//
// Created by Nikolaj on 14-05-2025.
//

#ifndef UPLOADTOFTP_H
#define UPLOADTOFTP_H
#include <wifiS3.h>
#include <WiFiSSLClient.h>
#include <ledMatrix.h>

class uploadToServer {
    public:

        void uploadToAPI(const char* endpoint,const char* data);

    private:
    const char* serverDomain = "server.es.launchify.dk";
    IPAddress serverIP = IPAddress(192, 168,131,202);
    uint16_t serverPort = 443;
    WiFiSSLClient wifiClient;
    ledMatrix matrix;
};

#endif //UPLOADTOFTP_H
