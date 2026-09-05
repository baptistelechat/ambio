<h1 align="center">Ambio 📺</h1>

<p align="center">
  <i>Un économiseur d'écran Android Daydream custom, servi en direct depuis un Raspberry Pi — parce que le mode ambiant natif de la TV TCL est cassé.</i>
</p>

<p align="center">
  <a href="README.md">🇬🇧 Read in English</a>
</p>

<p align="center">
  <img src="https://shieldcn.dev/badge/platform-Raspberry%20Pi%20%7C%20Android%20TV-c51a4a.svg" alt="platform" />
  <img src="https://shieldcn.dev/badge/status-in%20progress-orange.svg" alt="status" />
</p>

## 📸 Aperçu

> _Ajouter des captures d'écran ici_

## 🚀 Fonctionnalités clés

- **Éditeur d'écran de veille custom** : un éditeur web drag & drop (`react-rnd`) pour placer librement les widgets sur le canvas de la TV.
- **Synchro live** : les modifications poussées depuis l'éditeur arrivent instantanément sur la TV via un WebSocket dédié (`/ws`).
- **Widgets intégrés** : météo (Open-Meteo, sans clé API), horloge/date, proverbe du jour, et agenda (flux `.ics` public, proxifié côté serveur pour éviter les soucis de CORS).
- **Intégration Android native** : un `DreamService` charge l'écran de veille dans une WebView plein écran, avec un fallback hors-ligne si le Pi est injoignable.
- **Résilient par design** : survit aux redémarrages des deux côtés — `pm2` + systemd sur le Pi, boucle de retry sur la TV.

## 💻 Stack technique

| Catégorie       | Technologies                                                                                                                                                                                                                                                              |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **rpi-app**     | ![Vite](https://shieldcn.dev/badge/Vite-purple.svg) ![React](https://shieldcn.dev/badge/React%2019-blue.svg) ![TypeScript](https://shieldcn.dev/badge/TypeScript-blue.svg) ![Tailwind](https://shieldcn.dev/badge/Tailwind%204-cyan.svg) `shadcn/ui` `zustand` `zod` `ws` |
| **android-app** | ![Kotlin](https://shieldcn.dev/badge/Kotlin-7F52FF.svg) ![Android](https://shieldcn.dev/badge/Android-DreamService-3DDC84.svg)                                                                                                                                            |
| **Hardware**    | ![Raspberry Pi](https://shieldcn.dev/badge/Raspberry%20Pi%205-c51a4a.svg) TCL Android TV                                                                                                                                                                                  |

## 📦 Installation & démarrage

### rpi-app (éditeur + serveur de l'écran de veille)

1. **Clone le projet**
   ```bash
   git clone https://github.com/baptistelechat/Ambio.git
   cd Ambio/rpi-app
   ```
2. **Installe les dépendances**
   ```bash
   pnpm install
   ```
3. **Lance le serveur de développement**
   ```bash
   pnpm dev       # éditeur sur "/", rendu TV sur "/screensaver", API sur /api/*
   ```

La config est stockée dans `config.json` (généré au premier lancement, gitignored). Les fonds uploadés vivent dans `public/assets/` (également gitignored).

Pour ajouter un widget : crée un composant dans `src/widgets/`, enregistre-le dans `widgetLabels`/`widgetDefaults` (`src/lib/types.ts`) et dans le switch de `WidgetRenderer.tsx`.

### Redéployer sur le Pi après une modif

Le dev se fait en local (`pnpm dev` sur le PC, `http://localhost:5173`). Pour
livrer une modif sur le Pi, push sur git et pull côté Pi :

```bash
# sur le PC
git add -A && git commit -m "..." && git push

# sur le Pi
ssh <user>@<pi-host> "cd ~/Documents/ambio/rpi-app && git pull && pnpm install && pm2 restart ambio-screensaver"
```

`pm2 save` n'est nécessaire qu'une fois (déjà fait) ou si la liste des
process change elle-même (renommé/ajouté/supprimé) — un simple `pm2 restart`
suffit après chaque pull.

### android-app (écran de veille Daydream)

Projet Gradle/Kotlin standard — à ouvrir directement dans Android Studio (le wrapper Gradle sera proposé automatiquement à l'ouverture).

```bash
cd android-app
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Active-le comme écran de veille actif depuis l'icône de l'app (redirige vers le menu Daydream système) ou manuellement :

```bash
adb shell settings put secure screensaver_components com.baptistelechat.ambio/.MyDreamService
adb shell settings put secure screensaver_enabled 1
```

## 📂 Structure du projet

```
Ambio/
├── rpi-app/       # Serveur Vite : éditeur drag & drop + rendu plein écran, servi à la TV
├── android-app/   # DreamService Kotlin qui charge l'écran de veille du Pi dans une WebView
└── docs/          # prd.md, architecture.md, roadmap.md
```

## ⚠️ Contraintes connues

- Les IPs sont **en dur** dans `MyDreamService.kt` (`CANDIDATE_HOSTS`) : le PC de dev d'abord, puis le Pi — la TV essaie d'abord le serveur de dev du PC (pour voir les changements sans redéployer), puis bascule sur le Pi. Mettre à jour la liste si l'une des IPs change (bail DHCP), ou les réserver côté routeur.
- La synchro live utilise un WebSocket sur `/ws`, et non `/`, pour ne pas entrer en conflit avec le WebSocket HMR interne de Vite qui écoute déjà sur le même port HTTP.
- `react-rnd` est utilisé en mode **non contrôlé** (`default`, pas `position`/`size`) — en mode contrôlé, le composant se fige visuellement pendant le drag avec React 19.

## 🛡️ État actuel

- ✅ `rpi-app/` : build + lint OK, testé en local (éditeur, écran de veille, sync WebSocket live, upload de fond, widgets météo/heure/proverbe/agenda).
- ✅ Déployé sur le Pi via `pm2` (`ambio-screensaver`), survit au redémarrage (service systemd `pm2-batmat`).
  - Local : `http://192.168.1.210:5173`
  - Également joignable à distance via le tailnet Tailscale du domicile.
- ✅ `android-app/` : projet Kotlin complet (non compilé dans cet environnement — pas de SDK Android disponible). À ouvrir dans Android Studio.

---

Fait avec ❤️ par [Baptiste Lechat](https://github.com/baptistelechat)

## 📝 Licence

Ce projet est sous licence MIT.
