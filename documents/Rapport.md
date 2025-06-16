# H2 Fælles Projekt

EnviroSync - An environment monitoring station for collecting data, feedback from students and
correlating it to improve classroom environments

# Indholdsfortegnelse:

## TechStack:

### Frontend:

#### JavaScript

JavaScript blev udviklet i 1995 af Brendan Eich hos Netscape og er et interpreted language, hvilket
betyder at koden udføres direkte uden forudgående kompilering. Dette giver hurtig udvikling og
testing, men kan være langsommere ved køretid sammenlignet med compiled languages. JavaScript kører
i browseren og muliggør dynamisk manipulation af websider. Vi valgte JavaScript da vi allerede
havde et godt kendskab til sproget, og det er et af de mest udbredte sprog til webudvikling.

#### React

React er et JavaScript-bibliotek udviklet af Facebook i 2013 til at bygge brugergrænseflader. React
anvender en komponent-baseret arkitektur og en virtuel DOM for effektiv rendering. Vi valgte at
bruge React dels for at lære et nyt framework, og dels fordi det er et af de mest udbredte
biblioteker.

#### Material-UI

Material-UI er et React komponent-bibliotek, der implementerer Google's Material Design. Biblioteket
giver færdigbyggede, responsive komponenter, der er nemme at tilpasse. Vi valgte Material-UI for
at have ensartede og moderne UI-komponenter, så vi kunne fokusere på funktionalitet frem for
design.


### Backend:

#### Node.js

Node.js blev skabt i 2009 af Ryan Dahl og er et JavaScript runtime-miljø bygget på Chrome's V8
JavaScript engine. Node.js er ikke et sprog, men et miljø der tillader JavaScript at køre på
serveren. Det er et interpreted language med Just-In-Time (JIT) kompilering, hvilket giver fordele
fra både interpreted og compiled languages. Node.js er særligt egnet til I/O-intensive operationer
grundet dets event-drevne, non-blocking arkitektur. Vi valgte Node.js da Kasper allerede havde enorm
erfaring med det. Nikolaj og jeg har siden H1 lært Node.js igennem samarbejde med Kasper, og da
vi allerede havde valgt at lære React under denne opgave, mente vi ikke at det var værd at
overveje andre sprog eller miljøer.

#### Express.js

Express.js er et minimalisk web-framework til Node.js, udgivet i 2010. Vi valgte Express for dets
enkelthed og fleksibilitet i at oprette API-endpoints. Express giver et sæt funktioner til at
udvikle web- og mobilapplikationer uden at diktere en fast struktur. Vi valgte Express på grund
af vores tidligere erfaring med framework'et og hvor nemt det er at integrere det med Node.js.

#### C++


#### MySQL

MySQL er et open-source relationelt database styringssystem udviklet i 1995. Det bruger
Structured Query Language (SQL) til at interagere med data. MySQL er et compiled system, hvilket
betyder at selve databaseprogrammet er oversat til maskinkode, før det køres på computeren, i
modsætning til interpreted systemer hvor koden oversættes under kørslen. Dette giver generelt bedre
ydeevne ved databaseoperationer, da instruktionerne allerede er kompileret og klar til udførelse.
Vi valgte MySQL som vores database fordi det er det sprog vi har mest erfaring med og er det 
sprog som skolen har undervist i.

#### Sequelize

Sequelize er et Object-Relational Mapping (ORM) bibliotek til Node.js, lanceret i 2011. Det giver en
abstraktion over SQL-databaser og tillader os at interagere med databasen ved hjælp af
JavaScript-objekter i stedet for rå SQL-forespørgsler. Vi valgte Sequelize da vi synes det er
nemmere at arbejde med end at skrive SQL-forespørgsler direkte, og det giver os mulighed for at
skrive mere læsbar og vedligeholdelig kode.


### Authentication:

#### JSON Web Tokens (JWT)

JWT er en åben standard (RFC 7519) fra 2015, der definerer en kompakt og selvstændig måde at sikre
overførslen af information mellem parter som et JSON-objekt. JWTs er ikke et sprog, men en
token-baseret autentifikationsmekanisme. 
"HVORFOR VALGTE VI JSON WEB TOKENS (JWT)?" - Kasper

# Problemformulering:

Vi blev informeret om at der havde været utilfredshed med indeklimaet i klasse værelserne på skolen,
og at der var et ønske om at få mere data omkring indeklimaet, for at kunne forbedre det.

# Development (TDD):

En kort redegørelse for hvad TDD er.

# Versionsstyring (Git):

En kort redegørelse af hvad Git er.

# Programmerings Metodik:

En kort beskrivelse af hvad programmering metodik er og hvad agile principperne er, efterfulgt af en
forklaring på hvordan vi har kørt vores projekt.

# UML-diagram:

Et billede af vores UML-diagram, der viser de vigtigste klasser og deres relationer.

