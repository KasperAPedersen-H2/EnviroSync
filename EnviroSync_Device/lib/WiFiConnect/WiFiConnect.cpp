//
// Created by Nikolaj on 14-05-2025.
//

#include "WiFiConnect.h"

void WiFiConnect::getSerialNumber(){
    String checkSerialNumber;
    do{
        if (checkSerialNumber.length() > 0){
            serialNumber = checkSerialNumber;
        }
        byte mac[6];
        WiFi.macAddress(mac);
        char charSerialNumber[5];
        sprintf(charSerialNumber, "%02X%02X%02X", mac[3], mac[4], mac[5]);
        checkSerialNumber = charSerialNumber;
    }while (serialNumber != checkSerialNumber);
    updateApSsid();
}

bool WiFiConnect::connectSTA(const char* ssid, const char* password)
{
    WiFi.end();
    delay(100);
    WiFi.begin(ssid, password);

    unsigned long start = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start < 1500){}
    return WiFi.status() == WL_CONNECTED;
}

void WiFiConnect::startAP() const
{
    WiFi.end();
    delay(100);
    WiFi.beginAP(apSsid.c_str(), apPass.c_str());
}

void WiFiConnect::autoConnect(){
    String ssid, password;
    if (loadCredentials(ssid, password))
    {
        //if (connectSTA(ssid.c_str(), password.c_str()))
        //{
        //    getSerialNumber();
        //    Serial.println("WiFi: Connect to STA!");
        //    return;
        //}
    }
    Serial.println("WiFi: Starter AP");
    getSerialNumber();
    startAP();
    serverStart();
}

void WiFiConnect::serverStart(){
    WiFiServer server(80);
    server.begin();
    bool goodSTA = false;

    while (!goodSTA){
        if (WiFiClient client = server.available()) {
            String request = "";
            while (client.connected()) {
                if (client.available()) {
                    char c = client.read();
                    request += c;

                    if (c == '\n'){
                        int getPos = request.indexOf("GET ");
                        int httpPos = request.indexOf(" HTTP");
                        String path = "/";
                        if(getPos != -1 && httpPos != -1) {
                            path = request.substring(getPos + 4, httpPos);
                        }

                        if (request.indexOf("GET /setup?") != -1){
                            int ssidPos = request.indexOf("ssid=");
                            int passPos = request.indexOf("password=");
                            client.println("HTTP/1.1 200 OK");
                            client.println("Content-Type: text/html");
                            client.println();
                            client.print(html.WIFI_setup("loading"));

                            delay(1000);
                            if (ssidPos != -1 && passPos != -1)
                            {
                                String ssid = request.substring(ssidPos+5, passPos-1);
                                String password = request.substring(request.indexOf("=",passPos)+1, request.indexOf(" ", passPos));
                                ssid.replace("+", " ");
                                Serial.println("Saving credentials");
                                Serial.println("ssid: " + ssid);
                                Serial.println("password: " + password);
                                if (connectSTA(ssid.c_str(), password.c_str()))
                                {
                                    saveCredentials(ssid, password);
                                    goodSTA = true;
                                    client.println("success");
                                }else
                                {
                                    client.println("failed");
                                    startAP();
                                    client.println(html.WIFI_setup("home"));
                                }
                            }
                        }else{
                            client.println(html.WIFI_setup("home"));
                        }
                        break;
                    }
                }
            }
        }
    }
}

void WiFiConnect::saveCredentials(const String& ssid, const String& password){
    preferences.begin("wifi", false);
    preferences.putString("ssid", ssid);
    preferences.putString("password", password);
    preferences.end();
}

bool WiFiConnect::loadCredentials(String& ssid, String& password){
    preferences.begin("wifi", true);
    ssid = preferences.getString("ssid", "");
    password = preferences.getString("password", "");
    preferences.end();
    return ssid.length() > 0 && password.length() > 0;
}
