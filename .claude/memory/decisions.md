---
register: decisions
---

## Index

| ID                              | Date       | Titre                                                                | Tags                                                                | Statut |
| ------------------------------- | ---------- | -------------------------------------------------------------------- | ------------------------------------------------------------------- | ------ |
| [BDR-001](decisions/BDR-001.md) | 2026-09-05 | WebSocket de sync sur `/ws` plutôt que `/`                           | #websocket #vite #hmr #rpi-app #architecture                        | actif  |
| [BDR-002](decisions/BDR-002.md) | 2026-09-05 | IP du RPi codée en dur dans l'app Android                            | #android #kotlin #dreamservice #ip-statique                         | actif  |
| [BDR-003](decisions/BDR-003.md) | 2026-09-05 | Déploiement RPi via `git pull`, plus scp/tar manuel                  | #git #deploiement #rpi #pm2 #workflow                               | actif  |
| [BDR-004](decisions/BDR-004.md) | 2026-09-05 | PC de dev prioritaire sur le RPi (`CANDIDATE_HOSTS`)                 | #android #kotlin #dreamservice #ip-statique #dev-workflow           | actif  |
| [BDR-005](decisions/BDR-005.md) | 2026-09-05 | Valider les frontières réseau même sans auth (LAN)                   | #securite #api #upload #ssrf #rpi-app                               | actif  |
| [BDR-006](decisions/BDR-006.md) | 2026-09-05 | Wrapper Gradle committé + build Android autonome                     | #android #gradle #build #autonomie                                  | actif  |
| [BDR-007](decisions/BDR-007.md) | 2026-09-06 | Placement des widgets en grille façon Android                        | #grid #react-rnd #drag-drop #android-launcher #widget-placement #ux | actif  |
| [BDR-008](decisions/BDR-008.md) | 2026-09-06 | Réglages de widgets pilotés par des données                          | #settings #data-driven-ui #widgets #forms #react                    | actif  |
| [BDR-009](decisions/BDR-009.md) | 2026-09-06 | Météo WigggleUI sur réglage `location`, pas géoloc                   | #weather #geolocation #webview #tv #open-meteo                      | actif  |
| [BDR-010](decisions/BDR-010.md) | 2026-09-06 | Registre tiers divergent : garder les primitives du projet           | #shadcn #design-system #registry #radix #base-ui                    | actif  |
| [BDR-011](decisions/BDR-011.md) | 2026-09-07 | Fond dégradé : presets curés plutôt qu'un color picker libre         | #wallpaper #gradient #grainient #ux #curated-presets                | actif  |
| [BDR-012](decisions/BDR-012.md) | 2026-09-12 | Adoption des 3 plugins Vite incontournables dans rpi-app             | #vite #plugin #rpi-app #tooling                                     | révisé |
| [BDR-013](decisions/BDR-013.md) | 2026-09-12 | Retrait de `vite-plugin-mkcert` peu après son adoption               | #vite #mkcert #https #android #webview #tooling                     | actif  |
| [BDR-014](decisions/BDR-014.md) | 2026-09-12 | Éditeur mobile en onglets Widget/Fond, action hors du scroll         | #mobile #tabs #ux #editor #drawer                                   | actif  |
| [BDR-015](decisions/BDR-015.md) | 2026-09-12 | QR code widget : `react-qr-code` (SVG) plutôt que canvas             | #qrcode #react-qr-code #svg #tv-webview #performance                | actif  |
| [BDR-016](decisions/BDR-016.md) | 2026-09-12 | Fête du jour : `abalin.net` (civil) plutôt que Nominis (liturgique)  | #api #fete-du-jour #nameday #cors #nominis #abalin                  | actif  |
| [BDR-017](decisions/BDR-017.md) | 2026-09-12 | Qualité de l'air éclatée en widgets unitaires + vue combinée         | #air-quality #widget-design #composition #open-meteo                | actif  |
| [BDR-018](decisions/BDR-018.md) | 2026-09-12 | Palette WiggleUI sous-catégorisée par thème                          | #palette #editor #ux #widget-picker #categorization                 | actif  |
| [BDR-019](decisions/BDR-019.md) | 2026-09-12 | Widget statut RPi limité à 3 métriques (temp, RAM, uptime)           | #widget-design #system-status #ux #scope #raspberry-pi #simplicity  | actif  |
| [BDR-020](decisions/BDR-020.md) | 2026-09-12 | Largeur de widget pilotée par override d'instance (`settings.width`) | #widget-sizing #grid #architecture #react                           | actif  |
| [BDR-021](decisions/BDR-021.md) | 2026-09-12 | Flux RSS résolus uniquement via un catalogue serveur                 | #security #ssrf #rss #api-design                                    | actif  |
| [BDR-022](decisions/BDR-022.md) | 2026-09-12 | Réassignation automatique du dream Android (`DreamRegistrar`)        | #android #dreamservice #self-healing #settings-secure               | actif  |
