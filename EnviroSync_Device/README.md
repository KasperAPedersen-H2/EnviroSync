# EnviroSync_Device

## Indholdsfortegnelse
> 1. [Projektbeskrivelse](#projektbeskrivelse)
> 2. [Projektstruktur](#projektstruktur)
> 3. [Biblioteker](#biblioteker)
> 4. [Installation og Opsætning](#installation-og-opsætning)

## Projektbeskrivelse
> EnviroSync_Device er et C++ projekt designet til at indsamle miljødata gennem sensorer og synkronisere disse data med en server. Projektet er bygget med fokus på miljøovervågning og dataindsamling.

## Projektstruktur
> Projektet er organiseret i følgende hovedmapper:
>
> - **src/** - Indeholder hovedprogrammet
>   - `main.cpp` - Programmets hovedfil
>
> - **lib/** - Indeholder projektets biblioteker
>   - `HTML/` - Bibliotek til HTML-håndtering
>   - `sensor/` - Bibliotek til sensorhåndtering
>   - `ntpClock/` - Bibliotek til tidssynchronisering via NTP
>   - `WiFiConnect/` - Bibliotek til WiFi-forbindelse
>   - `uploadToServer/` - Bibliotek til server upload funktionalitet

## Biblioteker

### HTML Bibliotek
> - Håndterer HTML-formattering og visning
> - Bruges til at generere brugergrænseflader og datavisning

### Sensor Bibliotek
> - Administrerer sensorinteraktioner og dataindsamling
> - Håndterer kalibrering og datavalidering

### NTP Clock Bibliotek
> - Sikrer præcis tidssynkronisering via NTP-protokol
> - Tidstempler for nøjagtig datalogging

### WiFi Connect Bibliotek
> - Håndterer WiFi-forbindelser og netværkskommunikation
> - Automatisk reconnect og netværkshåndtering

### Upload to Server Bibliotek
> - Håndterer dataoverførsel til server
> - Implementerer fejlhåndtering og genopretning

## Installation og Opsætning

### Forudsætninger
> - C++ kompiler
> - CLion IDE (anbefalet)
> - Internetforbindelse til NTP og serverupload

### Installation
> 1. Klon projektet:
> ```bash
> git clone https://github.com/Fischeriet/EnviroSync-Device.git
> ```
>
> 2. Åbn projektet i CLion
>
> 3. Byg projektet ved hjælp af den indbyggede byggefunktion

### Konfiguration
> 1. Konfigurer WiFi-indstillinger i WiFiConnect biblioteket
> 2. Indstil server-endpoints i uploadToServer biblioteket
> 3. Kalibrer sensorer efter behov

## Vedligeholdelse
> Projektet vedligeholdes gennem Git versionsstyring. Følg disse retningslinjer:
> - Commit regelmæssigt ændringer
> - Dokumentér alle væsentlige ændringer
> - Test grundigt før push til main branch

## Bidrag
> For at bidrage til projektet:
> 1. Fork repository'et
> 2. Opret en feature branch
> 3. Commit dine ændringer
> 4. Push til branch'en
> 5. Opret en Pull Request