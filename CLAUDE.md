## 💻 Ambio

Custom screensaver for a TCL TV, controlled via drag & drop: a Vite server running on a Raspberry Pi serves an editor and a fullscreen render page, loaded inside an Android app (`DreamService`) on the TV. Works around the TV's broken native ambient mode.

### Tech stack

- **Language**: TypeScript (`rpi-app/`) + Kotlin (`android-app/`)
- **Framework**: Vite + React 19 (`rpi-app/`), Android/Gradle (`android-app/`)
- **Runtime / Package manager**: Node.js + pnpm (`rpi-app/`), Gradle wrapper (`android-app/`)
- **Styling**: Tailwind CSS + shadcn/ui (radix-ui, class-variance-authority, tailwind-merge)
- **State**: Zustand
- **Validation**: Zod
- **Deployment**: Raspberry Pi via pm2 (`ambio-screensaver`), systemd service `pm2-batmat`, local + Tailscale access

### Architecture

Monorepo with two independent sub-projects: `rpi-app/` (Vite server + drag & drop editor + API + WebSocket) and `android-app/` (Kotlin app with a `DreamService` that loads the RPi's WebView). See `docs/prd.md`, `docs/architecture.md`, `docs/roadmap.md`.

### Important conventions

- Live sync WebSocket on `/ws` (never `/`) to avoid conflicting with Vite's internal HMR
- `react-rnd` (editor drag & drop) always in **uncontrolled** mode (`default`) — controlled mode visually freezes the drag under React 19
- Adding a widget: create a component in `rpi-app/src/widgets/`, add an entry to `widgetLabels`/`widgetDefaults` (`rpi-app/src/lib/types.ts`), and to the switch in `WidgetRenderer.tsx`
- RPi IP hardcoded in `android-app/.../MyDreamService.kt` (`RPI_URL`) — update manually if the DHCP lease changes
