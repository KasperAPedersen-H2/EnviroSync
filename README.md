# EnviroSync

EnviroSync er en komplet applikation, der består af både en **frontend** og en **backend**. Projektet er designet til at give en glat og skalerbar løsning til datahåndtering og brugerinteraktion.

## Indholdsfortegnelse

- [Introduktion](#introduktion)
- [Funktioner](#funktioner)
- [Projektstruktur](#projektstruktur)
- [Opsætning](#opsætning)
    - [Globale forudsætninger](#globale-forudsætninger)
    - [Backend](#backend)
    - [Frontend](#frontend)
- [Scripts](#scripts)
- [Teknologi Stack](#teknologi-stack)
- [Kontakt](#kontakt)

---

## Introduktion

EnviroSync er udviklet for at tilbyde en sømløs integration mellem backend og frontend. Det giver API-understøttede funktioner for brugergodkendelse og datahåndtering, samt en intuitiv frontend-brugergrænseflade.

---

## Funktioner

- **Frontend**:
    - Moderne UI udviklet med React
    - Responsivt design for både desktop og mobile enheder

- **Backend**:
    - RESTful API bygget på Express.js
    - Brugergodkendelse med JWT
    - Databaselagring via MySQL og Sequelize

---

## Projektstruktur

```
EnviroSync
├── client/                     # Frontend-applikation
│   ├── public/           
│   ├── src/              
│   ├── .env              
│   ├── package.json       
│
├── documents/                  #
│   ├── erd.png
│   ├── color_palette.txt
│
├── server/                     # Backend-applikation
│   ├── middleware/
│   │   ├── auth.js
│   │                 
│   ├── orm/   
│   │   ├── models/
│   │   │   ├── data.js
│   │   │   ├── devices.js
│   │   │   ├── messages.js
│   │   │   ├── rooms.js
│   │   │   ├── users.js
│   │   │   
│   │   ├── database.js
│   │   ├── dummy.js
│   │   ├── models.js
│   │              
│   ├── routes/          
│   │   ├── api.js
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── user.js
│   │
│   ├── app.js              
│   ├── secret.js              
│   ├── .env              
│   ├── package.json         
│
├── README.md                   # Overordnet projekt-dokumentation
├── package.json
```


---

## Opsætning

### Globale forudsætninger

For at køre projektet, vær sikker på at følgende er installeret:

- [Node.js](https://nodejs.org) (mindst version 16.0.0)
- [NPM](https://www.npmjs.com/)
- MySQL-server opsat og kørende

---

### Backend

1. Gå til backend-mappen:
   ```bash
   cd server
   ```

2. Installer nødvendige pakker:
   ```bash
   npm install
   ```

3. Opret en `.env`-fil og konfigurer miljøvariabler:
   ```bash
   DB_NAME=
   DB_USER=root
   DB_PASS=
   DB_HOST=localhost
   DB_DIALECT=mysql
   JWT_SECRET=
   ```

4. Start backend:
   ```bash
   npm start
   ```

---

### Frontend

1. Gå til frontend-mappen:
   ```bash
   cd client
   ```

2. Installer nødvendige pakker:
   ```bash
   npm install
   ```

3. Start frontend-udviklingsserver:
   ```bash
   npm start
   ```

---

## Scripts

- **Start både backend og frontenden**:
  - `npm run start:all`

- **Start frontend**:
    - `npm run start:frontend`

- **Start backend**:
    - `npm run start:backend`

---

## Teknologi Stack

**Frontend**:
- React
- React Router
- Material-UI (MUI)

**Backend**:
- Node.js
- Express.js
- Sequelize
- MySQL

**Autentifikation**:
- JSON Web Tokens (JWT)

---

## Kontakt

Hvis du har spørgsmål eller forslag, er du velkommen til at kontakte projektteamet.

- **Email**: [kasper@launchify.dk](mailto:kasper@launchify.dk)
- **GitHub Repository**: [EnviroSync på GitHub](#)