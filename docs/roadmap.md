# Roadmap — Écran de veille personnalisé (TCL TV + RPi)

## Contexte

Écran de veille custom pour TV TCL (Android TV / Google TV) contournant le
`DreamService` natif défaillant (`com.google.android.apps.tv.dreamx/.service.Backdrop`),
avec configuration centralisée et personnalisable hébergée sur un Raspberry Pi.

## Architecture cible

```
┌───────────────────────────────────────────┐
│           RPi — App Vite unique              │
│                                               │
│   Route "/"              Route "/screensaver" │
│   (éditeur drag & drop)   (rendu plein écran)  │
│                                               │
│         ↕ config.json + WebSocket (live sync)  │
└───────────────────────────────────────────┘
                      ▲
                      │ WebView charge cette URL
                      │
            ┌───────────────────┐
            │   TV — App Android   │
            │   (DreamService)      │
            └───────────────────┘
```

---

## Phase 0 — Setup & validation du concept

- [ ] Créer le projet Android (Android Studio, module unique)
- [ ] Créer le projet Vite sur le RPi (`npm create vite@latest`)
- [ ] Valider la chaîne complète avec un MVP minimal :
  - `DreamService` qui charge une page statique en dur (pas encore le RPi)
  - Vérifier l'enregistrement système : `adb shell settings put secure screensaver_components <package>/.MyDreamService`
  - Confirmer le déclenchement réel après inactivité (pas juste l'aperçu menu)

**Critère de sortie** : la TV affiche bien une page web en plein écran comme veille système, de façon fiable et reproductible.

---

## Phase 1 — App Android (TV)

### 1.1 `MyDreamService`
- [ ] Classe `DreamService` de base (`isInteractive`, `isFullscreen`, `isScreenBright`)
- [ ] `WebView` en plein écran pointant vers `http://<ip-rpi>:5173/screensaver`
- [ ] `WebViewClient` + `WebChromeClient` configurés (JS activé, DOM storage activé)

### 1.2 Test de disponibilité RPi + fallback
- [ ] Check HTTP (HEAD request, timeout 3s) avant de charger la WebView
- [ ] Fallback sur image statique locale (`res/drawable/fallback_screensaver`) si injoignable
- [ ] **Retry en arrière-plan** pendant l'affichage du fallback :
  - Coroutine qui repolle le RPi toutes les X secondes (ex: 30s) tant que le fallback est actif
  - Si le RPi redevient joignable → bascule automatique vers la WebView sans attendre la prochaine activation de veille
  - Annulation propre du retry dans `onDetachedFromWindow()` (éviter les fuites mémoire/coroutines zombies)

### 1.3 `MainActivity` (icône dans la liste des apps)
- [ ] Intent-filter `LAUNCHER` pour apparaître sur l'écran d'accueil
- [ ] Redirection automatique vers le menu Daydream système :
  `ComponentName("com.android.tv.settings", "com.android.tv.settings.device.display.daydream.DaydreamActivity")`
- [ ] Gestion d'erreur si le composant système n'existe pas (versions/fabricants différents) avec `Toast` explicite

### 1.4 Build & déploiement
- [ ] Build APK debug (`./gradlew assembleDebug`)
- [ ] Script d'install rapide : `adb install -r app-debug.apk`
- [ ] Documenter la commande d'activation manuelle (au cas où le menu Daydream ne suffit pas) :
  `adb shell settings put secure screensaver_components <package>/.MyDreamService`

**Critère de sortie** : app installée, icône visible et fonctionnelle, fallback + retry testés en coupant volontairement le RPi.

---

## Phase 2 — Backend léger sur le RPi (dans Vite, pas de serveur séparé)

### 2.1 API config
- [ ] Middleware Vite custom (`configureServer`) exposant :
  - `GET /api/config` → lit et renvoie `config.json`
  - `POST /api/config` → écrit `config.json` sur disque
- [ ] Structure initiale de `config.json` (voir Phase 4 pour le détail du schéma)

### 2.2 Live sync (WebSocket)
- [ ] `WebSocketServer` (package `ws`) greffé sur `server.httpServer` de Vite (même port, pas de port séparé)
- [ ] Éditeur (`/`) envoie un message au save → `/screensaver` écoute et re-render sans reload

### 2.3 Assets
- [ ] Endpoint ou dossier statique pour servir les images/vidéos de fond (`/assets/*`)
- [ ] Prévoir une limite de taille raisonnable (perf WebView sur TV = matériel modeste)

**Critère de sortie** : `GET/POST /api/config` fonctionnels, WebSocket qui pousse bien une notif de changement testable via un client WS basique (ex: `wscat`).

---

## Phase 3 — Route `/screensaver` (rendu TV)

- [ ] Layout plein écran (`100vw`/`100vh`, pas de scroll)
- [ ] Fetch `/api/config` au chargement
- [ ] Écoute WebSocket → re-render réactif en cas de changement
- [ ] Positionnement des widgets en CSS absolu selon les coordonnées du JSON
- [ ] Fond (image/vidéo) en arrière-plan, widgets en overlay
- [ ] Vanilla JS/React léger — privilégier la perf (le SoC de la TV est limité)

### Widgets — première vague
- [ ] Météo (API type OpenWeatherMap ou Open-Meteo, gratuite)
- [ ] Heure/date
- [ ] Proverbe/citation du jour
- [ ] Agenda (à définir : Google Calendar API, ou iCal simple)

### Widgets — vague 2 (optionnel)
- [ ] Prochain match ESPC Champagné 72 (réutilisation des données club existantes)
- [ ] Fil d'actu RSS
- [ ] Anniversaires du jour

**Critère de sortie** : page `/screensaver` affichée correctement sur la TV via la WebView, widgets visibles et à jour.

---

## Phase 4 — Éditeur `/` (drag & drop)

### 4.1 Canvas
- [ ] `<div>` en `aspect-ratio: 16/9` simulant l'écran TV
- [ ] Intégration `react-rnd` ou `react-grid-layout` pour déplacer/redimensionner

### 4.2 Schéma `config.json` (à affiner)
```json
{
  "background": { "type": "image", "url": "/assets/bg1.jpg" },
  "widgets": [
    {
      "id": "weather",
      "type": "weather",
      "x": 20, "y": 20,
      "width": 300, "height": 150,
      "settings": { "location": "Challans" }
    }
  ]
}
```

### 4.3 Fonctionnalités éditeur
- [ ] Ajout/suppression de widgets depuis une palette
- [ ] Panneau de settings par widget sélectionné
- [ ] Upload d'image/vidéo de fond
- [ ] Bouton "Publier" → `POST /api/config` + notif WebSocket

**Critère de sortie** : modification visuelle dans l'éditeur → republication → mise à jour visible sur la TV en quelques secondes, sans redémarrage de l'app.

---

## Phase 5 — Finitions

- [ ] Gestion d'erreurs réseau côté éditeur (RPi injoignable, sauvegarde échouée)
- [ ] Persistance de la sélection du widget en cours d'édition (éviter de tout reperdre en cas de refresh)
- [ ] Responsive de l'éditeur pour usage mobile (glisser avec le doigt)
- [ ] Documentation rapide (README) : setup RPi, build/install APK, ajout d'un nouveau widget

---

## Stack récapitulative

| Composant | Techno |
|---|---|
| App TV | Kotlin, `DreamService`, `WebView` |
| Serveur RPi | Vite (middleware custom + `ws`) |
| Éditeur | React + TypeScript + Tailwind/shadcn, `react-rnd` |
| Rendu veille | HTML/CSS/JS léger (React optionnel) |
| Stockage config | `config.json` sur disque (pas de DB nécessaire) |
| Communication live | WebSocket |

## Notes techniques importantes

- Timeout du check RPi : 3s (compromis fluidité veille / fiabilité détection)
- Intervalle de retry en fallback : 30s (ajustable selon retour d'expérience)
- Toujours annuler les coroutines/timers dans `onDetachedFromWindow()`
- Le réglage `screensaver_components` survit aux redémarrages TV — pas besoin de re-run ADB à chaque boot
