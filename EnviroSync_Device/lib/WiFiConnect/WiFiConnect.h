//
// Created by Nikolaj on 14-05-2025.
//

#pragma once
#include <Preferences.h>
#include <WiFiS3.h>
#include <HTML.h>

class WiFiConnect {
public:
    String serialNumber;

    void getSerialNumber();

    static bool connectSTA(const char* ssid, const char* password);

    void startAP() const;

    void autoConnect();

    void serverStart();

private:
    String apSsid;
    String apPass = "";
    Preferences preferences;
    HTML html;

    bool loadCredentials(String& ssid, String& password);
    void saveCredentials(const String& ssid, const String& password);
    void updateApSsid() { apSsid = "EnviroSync-" + serialNumber; }
};




