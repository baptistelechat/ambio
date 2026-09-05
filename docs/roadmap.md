# Roadmap — Écran de veille personnalisé (TCL TV + RPi)

## Contexte

Écran de veille custom pour TV TCL (Android TV / Google TV) contournant le
`DreamService` natif défaillant (`com.google.android.apps.tv.dreamx/.service.Backdrop`),
avec configuration centralisée et personnalisable hébergée sur un Raspberry Pi.

## État actuel (2026-09-05)

**L'app Android est fonctionnelle et validée en conditions réelles sur la TV
TCL — on n'y retouche plus sauf nouvelle feature.** Le RPi tourne en
production (`pm2`, survit au reboot). Reste quelques finitions côté éditeur
(non bloquantes) — voir [Reste à faire](#reste-à-faire).

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

## Phase 0 — Setup & validation du concept ✅

- [x] Créer le projet Android (Android Studio, module unique)
- [x] Créer le projet Vite sur le RPi
- [x] Valider la chaîne complète : `DreamService` → RPi → rendu réel sur la TV
  - [x] Enregistrement système (`adb shell settings put secure screensaver_components ...`)
  - [x] Déclenchement réel confirmé sur la TV (pas juste l'aperçu menu)

**Critère de sortie** : atteint.

---

## Phase 1 — App Android (TV) ✅

### 1.1 `MyDreamService`

- [x] Classe `DreamService` de base (`isInteractive`, `isFullscreen`, `isScreenBright`)
- [x] `WebView` en plein écran pointant vers l'URL du RPi
- [x] `WebViewClient` + `WebChromeClient` configurés (JS + DOM storage activés)
- [x] `useWideViewPort` + `loadWithOverviewMode` pour que la WebView respecte le viewport réel de l'écran

### 1.2 Test de disponibilité RPi + fallback

- [x] Check HTTP (HEAD, timeout 3s) avant de charger la WebView
- [x] **Dual-IP** : teste le PC de dev en premier (itération sans redéploiement), puis le RPi (`CANDIDATE_HOSTS`)
- [x] Fallback sur image statique locale si injoignable
- [x] Retry en arrière-plan (coroutine, 30s), annulé proprement dans `onDetachedFromWindow()`
- [ ] Fallback/retry pas encore testé en coupant volontairement le RPi/PC en conditions réelles

### 1.3 `MainActivity`

- [x] Intent-filter `LAUNCHER` + `LEANBACK_LAUNCHER` (visible dans le launcher TV)
- [x] Redirection automatique vers le menu Daydream système
- [x] Gestion d'erreur (`Toast`) si le composant système n'existe pas

### 1.4 Build & déploiement

- [x] Wrapper Gradle committé (`gradlew`, `gradle-wrapper.jar`) — indépendant du cache Android Studio
- [x] `android-app/build-and-install.sh` : build + `adb install` en une commande, sans IDE
- [x] Activation manuelle documentée (`docs/android-studio-setup.md`)
- [x] Debug WebView distant activé (`setWebContentsDebuggingEnabled`) pour diagnostics futurs

**Critère de sortie** : atteint — app installée, testée en plein écran réel sur la TV TCL, rendu correct (bug de largeur/hauteur diagnostiqué et corrigé via CDP).

---

## Phase 2 — Backend RPi (dans Vite) ✅

### 2.1 API config

- [x] `GET/POST /api/config` (middleware Vite custom)
- [x] `POST /api/upload` — allowlist d'extensions (png/jpg/jpeg/webp/gif/mp4/webm)
- [x] `GET /api/agenda?url=` — proxy ICS avec validation de protocole (anti-SSRF)

### 2.2 Live sync (WebSocket)

- [x] `WebSocketServer` greffé sur le port HTTP de Vite
- [x] **Sur `/ws`**, pas `/` (déviation volontaire : évite le conflit avec le WebSocket HMR interne de Vite)
- [x] Éditeur → publication → `/screensaver` re-render sans reload

### 2.3 Assets

- [x] `/assets/*` servi via le dossier `public/` de Vite (natif, pas de code custom)
- [x] Limite implicite via l'allowlist d'extensions

**Critère de sortie** : atteint, testé en local + en production sur le RPi.

---

## Phase 3 — Route `/screensaver` ✅

- [x] Layout plein écran, mise à l'échelle JS (`useFullscreenScale`) — pas de CSS `calc()/min()` avec `vw` (invalide pour `scale()`, un nombre pur est requis)
- [x] Fetch `/api/config` + écoute WebSocket
- [x] Positionnement CSS absolu selon les coordonnées JSON
- [x] Fond (image/vidéo) en arrière-plan, widgets en overlay
- [x] React léger — perf validée sur le SoC de la TV

### Widgets — première vague

- [x] Météo (Open-Meteo, sans clé API)
- [x] Heure/date
- [x] Proverbe du jour (liste locale, rotation par jour de l'année)
- [x] Agenda (URL `.ics` publique, proxifiée côté serveur)

### Widgets — vague 2 (optionnel, non commencé)

- [ ] Prochain match ESPC Champagné 72
- [ ] Fil d'actu RSS
- [ ] Anniversaires du jour

**Critère de sortie** : atteint — rendu confirmé correct sur la TV (largeur pleine écran, widgets à jour).

---

## Phase 4 — Éditeur `/` ✅

### 4.1 Canvas

- [x] Canvas `aspect-ratio: 16/9`, mise à l'échelle via `ResizeObserver`
- [x] `react-rnd` en mode **non contrôlé** (`default`, pas `position`/`size`) — le mode contrôlé fige visuellement le drag avec React 19

### 4.2 Schéma `config.json`

- [x] Conforme au schéma prévu, validé par Zod côté serveur

### 4.3 Fonctionnalités éditeur

- [x] Ajout/suppression de widgets depuis une palette
- [x] Panneau de settings par widget sélectionné (Sheet)
- [x] Upload d'image/vidéo de fond
- [x] Bouton "Publier" → `POST /api/config` + broadcast WebSocket

**Critère de sortie** : atteint, testé en local (drag, resize, publication, sync live).

---

## Reste à faire

Rien de bloquant — finitions possibles lors d'un prochain dev :

- [ ] Gestion d'erreurs réseau éditeur plus robuste (actuellement : statut texte "Erreur de publication", pas de retry automatique)
- [ ] Persistance de la sélection du widget en cours d'édition (perdue au refresh)
- [ ] Responsive de l'éditeur pour usage mobile (glisser au doigt — non testé)
- [ ] Remplacer le fallback Android (`fallback_screensaver.xml`, placeholder vectoriel) par une vraie photo
- [ ] Tester le fallback/retry en coupant volontairement le RPi/PC pendant que la veille est active
- [ ] Widgets vague 2 (RSS, anniversaires, match ESPC) si besoin identifié plus tard

---

## Stack récapitulative

| Composant          | Techno                                                                       |
| ------------------ | ---------------------------------------------------------------------------- |
| App TV             | Kotlin, `DreamService`, `WebView`                                            |
| Serveur RPi        | Vite (middleware custom + `ws`)                                              |
| Éditeur            | React + TypeScript + Tailwind/shadcn, `react-rnd`, `zustand`                 |
| Rendu veille       | React léger                                                                  |
| Stockage config    | `config.json` sur disque (pas de DB nécessaire)                              |
| Communication live | WebSocket (`/ws`)                                                            |
| Déploiement RPi    | `pm2` + `git pull` (voir README)                                             |
| Build Android      | Gradle wrapper committé + `build-and-install.sh`, sans Android Studio requis |

## Notes techniques importantes

- Timeout du check RPi/PC : 3s
- Intervalle de retry en fallback : 30s
- Toujours annuler les coroutines/timers dans `onDetachedFromWindow()`
- Le réglage `screensaver_components` survit aux redémarrages TV
- `CANDIDATE_HOSTS` dans `MyDreamService.kt` : IP du PC de dev en premier, RPi en fallback — à mettre à jour si l'une des IP change (DHCP)
