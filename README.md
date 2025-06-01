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
├── EnviroSync-Frontend/  # Frontend-applikation
│   ├── node_modules/     
│   ├── public/           
│   ├── src/              
│   ├── .env              
│   ├── package.json      
│   ├── README.md         
│
├── EnviroSync-Backend/   # Backend-applikation
│   ├── node_modules/     
│   ├── src/              
│   ├── .env              
│   ├── package.json      
│   ├── README.md         
│
├── README.md              # Overordnet projekt-dokumentation
```


---

## Opsætning

### Globale forudsætninger

For at køre projektet, vær sikker på at følgende er installeret:

- [Node.js](https://nodejs.org) (mindst version 16.0.0)
- [NPM](https://www.npmjs.com/) eller [Yarn](https://yarnpkg.com/)
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

3. Opret en `.env`-fil og konfigurer miljøvariabler (f.eks. database, JWT-secret osv.).

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

- **Backend**:
    - `npm start`: Starter backend-serveren
    - `npm run dev`: Kører backend med live-opdateringer (kræver `nodemon`)

- **Frontend**:
    - `npm start`: Starter udviklingsserveren
    - `npm run build`: Bygger produktionsklar frontend-kode

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