# UniHub - PWA Prototype

Questo è il prototipo di UniHub, un'app per studenti universitari creata come Progressive Web App (PWA).

## Requisiti

- Node.js (versione 16 o superiore raccomandata)

## Come avviare il progetto in locale

1. Installa le dipendenze:
   ```bash
   npm install
   ```

2. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

3. Apri il link fornito nel terminale (es. http://localhost:5173).

## Funzionalità Sviluppate

- **Architettura SPA**: Sviluppata con React e Vite. La navigazione è gestita tramite uno stato interno per un prototipo veloce e reattivo.
- **PWA Ready**: `manifest.json` e `sw.js` (Service Worker) sono inclusi per permettere l'installazione su smartphone ("Aggiungi a schermata home").
- **Design Moderno**: Tema personalizzato in `index.css` con colori accademici (Navy Blue, Aqua Green) ed effetti glassmorphism.
- **Gestione Stato con LocalStorage**: 
  - Il profilo utente viene creato al primo avvio e salvato.
  - I crediti per il sistema di Peer-Tutoring (di base 3) sono persistenti.
- **Mock Data**: Le sezioni Bacheca, Mappa e Chat utilizzano dati finti ma interattivi con feedback visivi (toast notifications).

## Build per GitHub Pages

Per preparare il progetto per il deploy:

1. Crea la build per produzione:
   ```bash
   npm run build
   ```

2. Assicurati di aver configurato correttamente il `base` path nel `vite.config.js` se decidi di non fare il deploy sulla root del dominio (es. se la URL sarà `https://username.github.io/UniHub`, aggiungi `base: '/UniHub/'` nel file config).

3. Carica la cartella `dist/` sulla tua repository di GitHub Pages.
