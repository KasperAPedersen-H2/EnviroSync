//
// Created by Nikolaj on 14-05-2025.
//

#include "uploadToServer.h"

void uploadToServer::uploadToAPI(const char* endpoint,const char* data)
{
    if (endpoint == "/sensor/register")
        do {
            delay(100);
        } while (!wifiClient.connect(serverDomain, serverPort));
    else {
        if (!wifiClient.connect(serverDomain, serverPort)){
            Serial.println("Forbindelse ikke oprettet");
            return;
        }
    }

    const String request = String("POST ") + endpoint + " HTTP/1.1\r\n" +
                    "Host: " + serverDomain + "\r\n" +
                    "Content-Type: application/json\r\n" +
                    "Connection: close\r\n" +
                    "Content-Length: " + String(strlen(data)) + "\r\n" +
                    "\r\n" +
                    data;
    wifiClient.print(request);
    matrix.loadPixel();
    wifiClient.stop();
}