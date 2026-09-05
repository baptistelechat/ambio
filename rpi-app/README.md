# rpi-app

App Vite (React + TypeScript + Tailwind 4 + shadcn) unique servant :

- `/` — éditeur drag & drop de l'écran de veille
- `/screensaver` — rendu plein écran consommé par la WebView de la TV
- `/api/config`, `/api/upload`, `/api/agenda` — API intégrée (plugin Vite,
  voir `server/screensaverPlugin.ts`)
- WebSocket sur `/ws` — synchro live éditeur → écran de veille

Voir le `README.md` à la racine du dépôt pour le contexte complet du
projet (app Android, déploiement RPi).

```bash
pnpm install
pnpm dev
```
