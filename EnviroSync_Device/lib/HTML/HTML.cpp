//
// Created by Nikolaj on 13-05-2025.
//

#include "HTML.h"

String HTML::WIFI_setup(const String& chosePage)
{
    if (options.length() == 0)
    {
        int n = WiFi.scanNetworks();
        for (int i = 0; i < n; ++i)
        {
            String ssid = WiFi.SSID(i);
            options += "<option value=\"" + ssid + "\">" + ssid + "</option>";
        }
    }

    String homePage = R"rawliteral(
        <h1>EnviroSync</h1>
        <h2>Content to WiFi</h2>
        <form action="/setup" method="GET">
            <label for="ssid">SSID</label>
            <select name="ssid" id="ssid">
            <option value="" selected>Choose your WiFi</option>
            )rawliteral";
            homePage += options;
            homePage += R"rawliteral("
            </select>
            <label for="password">Password</label>
            <input type="password" id="password" name="password">
            <button type="submit">Save</button">
        </form>
    )rawliteral";

    String loadingPage = R"rawliteral(
        <h1>Loading...</h1>
        <h2>Please wait</h2>
    )rawliteral";
    
    String page = R"rawliteral(
    <!DOCTYPE html>
    <html>
        <head>
            <title>WiFi Setup</title>
            <script>
            if (window.location.search.length) {
                window.location.href = window.location.origin + window.location.pathname;
            }
            </script>
            </script>
            <style>
                :root{
                    --teamColor: #725AC1;
                    --teamBorder: 2px solid var(--teamColor);
                }
                *{
                    margin: 0;
                    padding: 0;
                    font-family: monospace, system-ui;
                }
                body{
                    height: 100dvh;
                    width: 100dvw;
                    background: linear-gradient(85deg, #ffffff, #00b9da);
                    display: grid;
                    place-items: center;
                }
                main{
                    padding: 20px;
                    background-color: #e8e8e8;
                    border-radius: 25px;
                    box-shadow: 10px 5px 5px #00000063;
                }
                h1{
                    font-size: 2em;
                }
                h2{
                    font-size: 1.2em;
                }
                form{
                    display: flex;
                    flex-direction: column;
                }
                form label{
                    margin-top: 15px;
                    margin-left: 5px;
                    font-size: 1em;
                }
                form select{
                    padding: 5px;
                    border: var(--teamBorder);
                    border-radius: 3px;
                    outline: none;
                }
                form input{
                    padding: 5px;
                    border: var(--teamBorder);
                    border-radius: 3px;
                    outline: none;
                }
                form button{
                    margin-top: 15px;
                    padding: 15px 30px;
                    background-color: #fff;
                    border: var(--teamBorder);
                    border-radius: 3px;
                    transition: ease-out 0.8s;
                    box-shadow: inset 0 0 0 0 var(--teamColor);
                }
                form button:hover{
                    color: #fff;
                    box-shadow:inset 0 -100px 0 0 var(--teamColor);
                }
                form button:active{
                    transform: scale(0.9);
                }
            </style>
        </head>
        <body>
            <main>
                )rawliteral";
                if (chosePage == "home"){page += homePage;}
                else if (chosePage == "loading"){page += loadingPage;}
                else{page += homePage;}
                page += R"rawliteral(
            </main>
        </body>
    </html>
    )rawliteral";

    return page;
}

