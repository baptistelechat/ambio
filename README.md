<h1 align="center">Ambio 📺</h1>

<p align="center">
  <i>A custom Android Daydream screensaver served live from a Raspberry Pi — because the TCL TV's built-in ambient mode is broken.</i>
</p>

<p align="center">
  <a href="README.fr.md">🇫🇷 Lire en français</a>
</p>

<p align="center">
  <img src="https://shieldcn.dev/badge/platform-Raspberry%20Pi%20%7C%20Android%20TV-c51a4a.svg" alt="platform" />
  <img src="https://shieldcn.dev/badge/status-in%20progress-orange.svg" alt="status" />
</p>

## 📸 Screenshots

> _Add screenshots here_

## 🚀 Key Features

- **Custom screensaver editor**: a drag & drop web editor (`react-rnd`) to freely place widgets on the TV canvas.
- **Live sync**: edits pushed from the editor reach the TV instantly over a dedicated WebSocket (`/ws`).
- **Built-in widgets**: weather (Open-Meteo, no API key), clock/date, daily quote, and agenda (public `.ics` feed, server-proxied to dodge CORS).
- **Native Android integration**: a `DreamService` loads the screensaver as a fullscreen WebView, with an offline fallback if the Pi is unreachable.
- **Resilient by design**: survives reboots on both ends — `pm2` + systemd on the Pi, retry loop on the TV.

## 💻 Technical Stack

| Category        | Technologies                                                                                                                                                                                                                                                              |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **rpi-app**     | ![Vite](https://shieldcn.dev/badge/Vite-purple.svg) ![React](https://shieldcn.dev/badge/React%2019-blue.svg) ![TypeScript](https://shieldcn.dev/badge/TypeScript-blue.svg) ![Tailwind](https://shieldcn.dev/badge/Tailwind%204-cyan.svg) `shadcn/ui` `zustand` `zod` `ws` |
| **android-app** | ![Kotlin](https://shieldcn.dev/badge/Kotlin-7F52FF.svg) ![Android](https://shieldcn.dev/badge/Android-DreamService-3DDC84.svg)                                                                                                                                            |
| **Hardware**    | ![Raspberry Pi](https://shieldcn.dev/badge/Raspberry%20Pi%205-c51a4a.svg) TCL Android TV                                                                                                                                                                                  |

## 📦 Installation & Getting Started

### rpi-app (editor + screensaver server)

1. **Clone the project**
   ```bash
   git clone https://github.com/baptistelechat/Ambio.git
   cd Ambio/rpi-app
   ```
2. **Install dependencies**
   ```bash
   pnpm install
   ```
3. **Start the development server**
   ```bash
   pnpm dev       # editor on "/", TV render on "/screensaver", API on /api/*
   ```

Config is stored in `config.json` (generated on first run, gitignored). Uploaded backgrounds live in `public/assets/` (also gitignored).

To add a widget: create a component in `src/widgets/`, register it in `widgetLabels`/`widgetDefaults` (`src/lib/types.ts`) and in the `WidgetRenderer.tsx` switch.

### Redeploying to the Pi after a change

Dev happens locally (`pnpm dev` on the PC, `http://localhost:5173`). To ship a
change to the Pi, push to git and pull on the other end:

```bash
# on the PC
git add -A && git commit -m "..." && git push

# on the Pi
ssh <user>@<pi-host> "cd ~/Documents/ambio/rpi-app && git pull && pnpm install && pm2 restart ambio-screensaver"
```

`pm2 save` is only needed once (already done) or again if the process list
itself changes (renamed/added/removed) — a plain `pm2 restart` is enough
after every pull.

### android-app (Daydream screensaver)

Standard Gradle/Kotlin project — open it directly in Android Studio (the Gradle wrapper prompt appears automatically).

```bash
cd android-app
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Enable it as the active screensaver from the app icon (redirects to the system Daydream menu) or manually:

```bash
adb shell settings put secure screensaver_components com.baptistelechat.ambio/.MyDreamService
adb shell settings put secure screensaver_enabled 1
```

## 📂 Project Structure

```
Ambio/
├── rpi-app/       # Vite server: drag & drop editor + fullscreen render, served to the TV
├── android-app/   # Kotlin DreamService that loads the Pi's screensaver in a WebView
└── docs/          # prd.md, architecture.md, roadmap.md
```

## ⚠️ Known Constraints

- IPs are **hardcoded** in `MyDreamService.kt` (`CANDIDATE_HOSTS`): the dev PC first, then the Pi — the TV tries the PC's dev server first (so changes are visible without redeploying), then falls back to the Pi. Update the list if either IP changes (DHCP lease), or reserve them on the router.
- The live sync WebSocket runs on `/ws`, not `/`, to avoid clashing with Vite's own HMR WebSocket on the same HTTP port.
- `react-rnd` is used **uncontrolled** (`default`, not `position`/`size`) — controlled mode visually freezes during drag with React 19.

## 🛡️ Current Status

- ✅ `rpi-app/`: builds and lints clean, tested locally (editor, screensaver, live WebSocket sync, background upload, weather/clock/quote/agenda widgets).
- ✅ Deployed on the Pi via `pm2` (`ambio-screensaver`), survives reboot (`pm2-batmat` systemd service).
  - Local: `http://192.168.1.210:5173`
  - Also reachable remotely over the home Tailscale tailnet.
- ✅ `android-app/`: complete Kotlin project (not compiled in this environment — no Android SDK available). Open it in Android Studio.

---

Made with ❤️ by [Baptiste Lechat](https://github.com/baptistelechat)

## 📝 License

This project is under MIT license.
