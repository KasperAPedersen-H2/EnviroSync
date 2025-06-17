//
// Created by Nikolaj on 13-05-2025.
//

#ifndef WIFI_SETUP_H
#define WIFI_SETUP_H
#include <WiFiS3.h>

class HTML
{
    public:
        String WIFI_setup(const String& chosePage);

    private:
        String options;
};

#endif //WIFI_SETUP_H
