# Architecture — Écran de veille personnalisé (TV TCL + RPi)

## 1. Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                        Raspberry Pi (réseau local)                 │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │              Process unique : Vite (dev/preview)             │    │
│   │                                                             │    │
│   │   HTTP Server                        WebSocket Server        │    │
│   │   ├─ "/"              (éditeur)      (greffé sur le même     │    │
│   │   ├─ "/screensaver"   (rendu TV)       port HTTP via `ws`)    │    │
│   │   ├─ "/api/config"    (GET/POST)                             │    │
│   │   └─ "/assets/*"      (images/vidéos statiques)               │    │
│   │                                                             │    │
│   │   Stockage : config.json (fichier local, pas de DB)          │    │
│   └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
              ▲ HTTP (édition)              ▲ HTTP + WS (rendu)
              │                              │
   ┌────────────────────┐        ┌────────────────────────┐
   │  PC / téléphone       │        │        TV TCL              │
   │  (navigateur)          │        │                            │
   │  → édite la config      │        │  App Android (Kotlin)        │
   └────────────────────┘        │  ├─ MainActivity              │
                                  │  │   (icône, redirige vers     │
                                  │  │    réglages Daydream)        │
                                  │  └─ MyDreamService              │
                                  │      ├─ check dispo RPi (3s)     │
                                  │      ├─ WebView → "/screensaver" │
                                  │      ├─ fallback image statique  │
                                  │      └─ retry périodique (30s)   │
                                  └────────────────────────┘
```

## 2. Composants

### 2.1 App Android (TV)

| Fichier | Rôle |
|---|---|
| `MainActivity.kt` | Point d'entrée visible (icône app). Redirige immédiatement vers `com.android.tv.settings/.device.display.daydream.DaydreamActivity` puis `finish()`. |
| `MyDreamService.kt` | Cœur du système. Étend `DreamService`. Vérifie la dispo réseau du RPi, affiche soit la `WebView`, soit le fallback. Gère le retry en coroutine. |
| `AndroidManifest.xml` | Déclare `MainActivity` (intent-filter `LAUNCHER`) et `MyDreamService` (intent-filter `android.service.dreams.DreamService`, permission `BIND_DREAM_SERVICE`). |
| `res/drawable/fallback_screensaver` | Image statique de secours, embarquée dans l'APK (pas de dépendance réseau). |

**Pourquoi un `DreamService` et pas une simple Activity ?**
C'est le seul type de composant Android reconnu par le système comme
"fournisseur d'écran de veille" (`android.service.dreams.DreamService`),
activable via le paramètre système `secure screensaver_components`. C'est
le même mécanisme utilisé par le service natif défaillant
(`com.google.android.apps.tv.dreamx/.service.Backdrop`) qu'on contourne.

### 2.2 Serveur RPi (Vite)

Un seul process Node.js (Vite), pas de backend Express séparé. La logique
serveur vit dans `vite.config.ts` via un plugin custom (`configureServer`)
qui :
- expose `/api/config` (lecture/écriture du fichier `config.json`)
- sert `/assets/*` en statique
- attache un `WebSocketServer` (`ws`) sur `server.httpServer` existant

**Pourquoi pas de base de données ?**
La configuration est un objet unique (une seule mise en page à la fois,
un seul utilisateur). Un fichier JSON est amplement suffisant, plus simple
à sauvegarder/versionner/déboguer qu'une DB.

### 2.3 Frontend Vite (2 routes, React Router)

| Route | Rôle | Techno |
|---|---|---|
| `/` | Éditeur drag & drop | React + TypeScript + Tailwind/shadcn + `react-rnd` |
| `/screensaver` | Rendu plein écran consommé par la WebView TV | JS léger (React optionnel selon perf constatée) |

Les deux routes partagent :
- le même schéma `config.json`
- le même client WebSocket (l'éditeur écrit, `/screensaver` écoute)

## 3. Flux de données

### 3.1 Édition → publication → affichage TV

```
1. Utilisateur modifie le layout dans "/"  (drag & drop, resize, settings widget)
2. Clic "Publier"  →  POST /api/config { widgets: [...], background: {...} }
3. Serveur Vite écrit config.json sur disque
4. Serveur Vite notifie tous les clients WS connectés (broadcast "config-updated")
5. "/screensaver" (ouvert dans la WebView TV) reçoit le message WS
6. Re-fetch GET /api/config + re-render, sans reload de page
```

### 3.2 Déclenchement de la veille (TV)

```
1. TV inactive → système appelle MyDreamService.onAttachedToWindow()
2. Coroutine : HEAD http://<ip-rpi>:5173/screensaver  (timeout 3s)
   ├─ Succès → affiche WebView(rpiUrl)
   └─ Échec  → affiche ImageView(fallback_screensaver)
                + lance une coroutine de retry (poll toutes les 30s)
                   └─ si dispo à nouveau → bascule vers WebView sans attendre
                      la prochaine activation de veille
3. onDetachedFromWindow() → annule toutes les coroutines en cours
```

## 4. Contrat d'API

### `GET /api/config`
Retourne la configuration courante.

**Réponse 200**
```json
{
  "background": { "type": "image", "url": "/assets/bg1.jpg" },
  "widgets": [
    {
      "id": "weather-1",
      "type": "weather",
      "x": 20, "y": 20,
      "width": 300, "height": 150,
      "settings": { "location": "Challans" }
    }
  ]
}
```

### `POST /api/config`
Remplace la configuration courante. Corps identique au format de sortie de
`GET`. Déclenche un broadcast WebSocket après écriture réussie.

**Réponse 200** : `{ "status": "ok" }`
**Réponse 500** : en cas d'échec d'écriture disque

### `GET /assets/:filename`
Sert un fichier statique (image/vidéo) précédemment uploadé.

### WebSocket `/` (même port que HTTP)
Messages serveur → client :
```json
{ "type": "config-updated" }
```
Le client (`/screensaver`) réagit en re-fetchant `/api/config`, il ne reçoit
pas la config directement dans le message (évite la désynchronisation si
plusieurs writes rapides).

## 5. Schéma de configuration détaillé

```ts
type Config = {
  background: {
    type: "image" | "video"
    url: string
  }
  widgets: Widget[]
}

type Widget = {
  id: string
  type: "weather" | "clock" | "quote" | "agenda" // extensible
  x: number       // position absolue en px, référentiel 1920x1080
  y: number
  width: number
  height: number
  settings: Record<string, unknown>  // spécifique à chaque type de widget
}
```

Le référentiel de coordonnées fixe (1920×1080) simplifie le rendu : la
WebView TV affiche toujours en plein écran à cette résolution logique,
mise à l'échelle par le CSS si besoin (`transform: scale()`), plutôt que
de gérer des positions en pourcentage partout.

## 6. Structure de fichiers proposée

```
screensaver-project/
├── android-app/
│   └── app/src/main/
│       ├── java/com/toncompte/screensaver/
│       │   ├── MainActivity.kt
│       │   └── MyDreamService.kt
│       ├── res/drawable/fallback_screensaver.png
│       └── AndroidManifest.xml
│
└── rpi-app/                      (app Vite unique)
    ├── vite.config.ts            (plugin config-api + WS)
    ├── config.json                (généré au runtime, gitignore)
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx                (React Router: "/" et "/screensaver")
    │   ├── routes/
    │   │   ├── Editor.tsx
    │   │   └── Screensaver.tsx
    │   ├── widgets/
    │   │   ├── WeatherWidget.tsx
    │   │   ├── ClockWidget.tsx
    │   │   ├── QuoteWidget.tsx
    │   │   └── AgendaWidget.tsx
    │   └── lib/
    │       ├── configClient.ts    (fetch + WS client partagé)
    │       └── types.ts
    └── public/assets/             (uploads images/vidéos)
```

## 7. Déploiement

| Composant | Méthode |
|---|---|
| App RPi (Vite) | `pm2` ou service `systemd` pour garder le process actif au boot du RPi |
| App Android | `adb install -r app-debug.apk` en dev ; build release signé si besoin de stabilité long terme |
| Activation du DreamService | `adb shell settings put secure screensaver_components <package>/.MyDreamService` (persiste après reboot TV) |

## 8. Décisions d'architecture (ADR résumées)

| Décision | Alternative écartée | Raison |
|---|---|---|
| Un seul process Vite (front + API + WS) | Backend Express séparé | Simplicité de déploiement/maintenance sur un RPi, un seul port à gérer |
| Fichier JSON pour la config | Base de données (SQLite, etc.) | Un seul objet de config, pas de requêtes relationnelles, overkill sinon |
| WebSocket plutôt que polling | Polling HTTP régulier côté `/screensaver` | Latence plus faible, moins de charge réseau/CPU sur le SoC modeste de la TV |
| `DreamService` natif Android | App tierce type Aerial Views custom-forkée | Contrôle total du code, personnalisation illimitée, réutilisation directe du RPi/stack existant |
| Coordonnées absolues (1920×1080) | Positions en pourcentage | Simplifie le rendu et le drag & drop, cohérent avec un affichage TV à résolution fixe connue |
