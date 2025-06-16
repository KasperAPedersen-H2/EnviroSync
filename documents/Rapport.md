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

C++ er et programmeringssprog udviklet af Bjarne Stroustrup i 1985 som en udvidelse af C-sproget.
C++ er et compiled language, hvilket betyder at kildekoden skal oversættes til maskinkode af en
compiler, før programmet kan køres. Denne kompileringsproces konverterer den menneskeligt læsbare
kode til direkte eksekverbare instruktioner for computeren. Fordelen ved compiled languages som C++
er højere køretidseffektivitet og bedre ydelse, da oversættelsen til maskinkode kun sker én gang (
ved kompilering) og ikke hver gang programmet køres. Vi var nødsaget til at burge C++ fordi
Arduino ikke understøtter andre sprog, og da vi skulle bruge en Arduino til at indsamle data
fra sensorerne, var C++ det eneste valg. Vi havde dog ikke erfaring med C++ på forhånd, men pga
vores erfaring med andre sprog, som C# og JavaScript, var det lidt nemmere at forstå syntaxen og
grundlæggende koncepter.

#### MySQL

MySQL er et open-source relationelt database styringssystem udviklet i 1995. Det bruger
Structured Query Language (SQL) til at interagere med data. MySQL er et compiled system, som
giver det de samme fordele som C++ i forhold til køretidseffektivitet og ydelse.
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

Test Driven Development (TDD) er en softwareudviklingsmetode, hvor test skrives før koden, der
implementerer funktionaliteten. TDD følger en cyklus kendt som "Red-Green-Refactor":

> 1. **Red**: Skriv en test, der fejler, fordi den ønskede funktionalitet endnu ikke er
     implementeret.
> 2. **Green**: Skriv den mindste mængde kode, der får testen til at bestå.
> 3. **Refactor**: Forbedr koden uden at ændre dens funktionalitet, og sørg for at alle tests stadig
     består.

Teoretisk så hjælper TDD med at sikre at koden er testet og fungerer som forventet, før den
implementeres.
I praksis lyder det mest af alt til ikke at være en god metode i sin teoretiske form, da det i
mange tilfælde ikke tager højde for konteksten koden skal bruges i. Det er ikke for at sige at TDD
ikke kan bruges som et princip i udviklingen, men at man under udviklingen bør være opmærksom på
sine tests og hvornår de kan være relevante at skrive. I vores projekt har vi ikke fulgt TDD som
det formuleres i teori, men vi har haft fokus på at teste vores kode før vi pushede til produktion.

# Versionsstyring (Git):

Git er et distribueret versionsstyringsværktøj, som blev udviklet af Linus Torvalds i 2005 til
udviklingen af Linux-kernen. Git holder styr på ændringer i kildekode over tid og muliggør
samarbejde mellem flere udviklere. Systemet fungerer gennem en række grundlæggende operationer:

> 1. **COMMIT** - Når en udvikler har lavet ændringer i koden, gemmes disse ændringer lokalt med en
     commit, der indeholder et øjebliksbillede af filerne, metadata om ændringerne og en reference
     til
     den foregående commit.
> 2. **BRANCH** - Git tillader udviklere at arbejde i separate grene (branches), hvor ændringer kan
     laves
     isoleret fra hovedkodebasen (main/master). Dette muliggør parallel udvikling af forskellige
     funktioner.
> 3. **MERGE** - Når arbejdet i en branch er færdigt, kan ændringerne integreres tilbage i
     hovedkodebasen
     gennem en merge-operation, der kombinerer ændringerne fra begge branches.
> 4. **PUSH/PULL** - Git's distribuerede natur betyder, at hver udvikler har en komplet kopi af
     repositoriet. Med push sendes lokale commits til et remote repository, mens pull henter
     ændringer
     fra et remote repository og integrerer dem i den lokale kopi.

Git's distribuerede arkitektur giver høj hastighed, dataintegritetsgarantier og mulighed for at
arbejde offline. Disse egenskaber, sammen med Git's effektive branching og merging, har gjort det
til det foretrukne versionsstyringsværktøj for moderne softwareudvikling.

# Programmerings Metodik:

Agile er den overordnede metodik som andre metodikker som Scrum og Kanban bygger på. Agile
manifestet blev offentliggjort i 2001 af en gruppe softwareudviklere fra forskellige baggrunde.

Manifestet fra agilemanifesto.org lyder:

> We are uncovering better ways of developing  
> software by doing it and helping others do it.  
> Through this work we have come to value:
> 
> **Individuals and interactions** over processes and tools  
> **Working software** over comprehensive documentation  
> **Customer collaboration** over contract negotiation  
> **Responding to change** over following a plan
>
> That is, while there is value in the items on  
> the right, we value the items on the left more.


Ud fra dette manifest er der blevet defineret 12 principper for agile softwareudvikling. Her vil
vil vi gennemgå nogle af de principper som vi selv føler er de vigtigste for os:

> 1. **Vores højeste prioritet er at tilfredsstille kunden gennem tidlig og kontinuerlig levering af
   værdifuld software.** - Dette princip understøtter vores lyst til at levere funktionalitet.

> 2. **Levér fungerende software hyppigt, fra et par uger til et par måneder, med en præference for
   den korteste tidsskala.** - Dette princip for os, betyder at levere funktionalitet når det er
   muligt, i stedet for at vente på en større release, og gør at vi løbende kan få aktuel
   feedback på vores produkt.

> 3. **Fungerende software er den primære måle enhed for fremskridt.** - Dette princip kan vi 
    > forholde
   os til, da vi har haft fokus på at levere funktionalitet i stedet for at fokusere på at lave
   dokumentation og andre ting, som ikke direkte bidrager til produktet.

# UML-diagram:

Et billede af vores UML-diagram, der viser de vigtigste klasser og deres relationer.

