# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Wordle-spel med highscore-lista

I denna uppgift ska du bygga ett Wordle-inspirerat spel med highscore-lista och “om”-sida.

Moment
Generellt
Spelet ska byggas i form av en fullstack-applikation med tre sidor (routes/URL:er): En startsida där man kan spela spelet, en statisk informationssida om projektet, och en server-side renderad highscore-lista
Serva hela siten med hjälp av node på port 5080, exempelvis med hjälp av express
Spelet
Spelet ska utvecklas fullstack, med GUI utvecklat i React, och delar av spellogiken på backend via ett API.
Spelets regler definieras av de algoritmer som beskrevs i kursens första uppgift
Spelet väljer ut ett slumpmässigt ord varje gång spelet startar – användaren kan bestämma hur många bokstäver ordet ska ha och om det får innehålla bokstäver som upprepas
Användaren gissar vad ordet är genom att skriva in det i ett fritextfält
Spelet ger feedback enligt feedback-algoritmen, genom att visa användarens bokstäver i grönt (correct), gult (misplaced) eller rött (incorrect)
När användaren gissar rätt ord är spelet över
Det slumpmässiga urvalet av ord ska ske på servern via ett API-anrop. En datakälla kan vara den datafil som finns på https://github.com/dwyl/english-words
Efter att användaren klarat spelet ska hen få möjlighet att ange sitt namn och skicka in resultatet till en highscore-lista. Den data som skickas in ska inkludera namnet, tiden från att spelet startade till att det slutade, gissningarna, samt inställningarna avseende ordets längd och unika bokstäver
Highscore-lista
På en separat sida/route ska en highscore-lista visas
Listan ska server-siderenderas
Informationssida
En statisk sida där ni beskriver projektet
Valfria moment
För ytterligare fördjupning och utmaning kan följande moment utföras. Inget av följande är nödvändigt för att uppgiften ska bli godkänd, men inkluderas i bedömningen av kursbetyget.

Highscore-listan filtreras på användarens inställningar avseende ordets längd och unika bokstäver. Filtreringen ska ske server-side och varje filterinställning ska ha en egen URL
Spelet och API ska implementeras på ett sådant sätt att det inte är möjligt att fuska, genom att backend ansvarar för feedback och tidtagning från att ordet väljs ut, till att spelet är över
Hela eller delar av spelet (exempelvis bara backend) utvecklas med hjälp av TypeScript
Integrationstester testar hela spelflödet, och slumpandet av ord mockas bort på något sätt så att spelflödet blir förutsägbart
Inlämning
Uppgiften lämnas in genom att koden publiceras på GitHub. Följande ska lämnas in via ItsLearning:

Länk till repot på GitHub
Länk till en PR som du vill ha feedback på
Projektet ska gå att köra vid bedömningen. Node-projektet ska vara konfigurerat så att:

Alla dependencies installeras när man kör “npm install” (måste finnas i package.json)
Servern går att starta med “npm start”
Test ska gå att köra med “npm test”
Betygskriterier
På denna uppgift kan man få betygen underkänt eller godkänt.

Betyg Godkänd
Enligt kursplanen: För att få betyget Godkänt (G) ska den studerande ha genomfört kursen och nått alla kursens läranderesultat.

Det betyder för denna uppgift:

Källkod redovisad via GitHub
Projektet går att starta med npm start, varpå sidan går att besöka på http://localhost:5080
Spel, highscore-lista och informationssida fungerar så som de beskrivs i moment
