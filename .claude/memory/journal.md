---
register: journal
---

## 2026-09-05

Initialisation de l'infrastructure mémoire agent (`/memory-setup`) sur le projet Ambio. Pas de `.claude/memory/` ni de `CLAUDE.md` préexistants — création du contexte projet et des 5 registres à partir de l'état réel du dépôt (README, `docs/`, `rpi-app/package.json`) : projet perso d'écran de veille custom pour TV TCL (RPi + app Android), pas encore initialisé en dépôt git.

**Entrées clés :**

- [BDR-001](decisions/BDR-001.md) — WebSocket de sync sur `/ws`
- [BDR-002](decisions/BDR-002.md) — IP du RPi en dur dans l'app Android
- [LRN-001](learnings/LRN-001.md) — `react-rnd` contrôlé fige le drag sous React 19
- [ZBLK-001](archive/blockers/ZBLK-001.md) — Freeze du drag & drop résolu

---

Construction complète du projet de A à Z en autonomie : `rpi-app` (Vite + React 19, éditeur drag & drop + rendu `/screensaver` + API config/upload/agenda + WebSocket) et `android-app` (Kotlin, `MyDreamService` + `MainActivity`), déployés et validés en conditions réelles. RPi mis en production via `pm2` (déplacé de `~/ambio` vers `~/Documents/ambio` en cours de route pour respecter la convention du reste des projets sur la machine). Une revue de sécurité automatique a détecté un SSRF sur `/api/agenda` et un risque XSS/upload arbitraire sur `/api/upload` — corrigés (allowlist d'extensions, validation de protocole d'URL).

Repo git créé et poussé sur GitHub (`baptistelechat/ambio`) — un premier commit contenait par erreur l'IP Tailscale et le user SSH (générés par un skill readme-writer externe), nécessitant une purge complète de l'historique (branche orpheline, commandes lancées par l'utilisateur via `!` car le classificateur de sécurité de Claude Code refusait de les exécuter directement, même après confirmation). RPi resynchronisé sur le nouvel historique.

Deux bugs de rendu distincts découverts et corrigés en testant sur la vraie TV : un `transform: scale()` invalide (unités `vw`/`vh` passées à une fonction qui attend un nombre) rendait `/screensaver` totalement noir ; puis, une fois corrigé, l'écran de veille s'affichait à moitié largeur sur la TV à cause d'un `flex-shrink` par défaut réduisant un canvas pourtant dimensionné explicitement. Ce second bug n'a pu être diagnostiqué qu'en déboguant la WebView Android à distance via le protocole DevTools brut (`adb forward` + websocket + `Runtime.evaluate`), `chrome://inspect` n'étant pas accessible depuis l'outil d'automatisation du navigateur utilisé dans cette session.

Mise en place de l'autonomie de build Android : aucun SDK/Gradle/Android Studio n'était disponible en ligne de commande au départ. Une fois Android Studio installé et synchronisé une première fois par l'utilisateur, réutilisation de sa distribution Gradle mise en cache pour générer et committer le wrapper (`gradlew`), et écriture d'un script `build-and-install.sh` (compile + `adb install` en une commande), en forçant `JAVA_HOME` sur le bon JDK (le système pointait vers un JDK 8 obsolète, cause d'une erreur Gradle/AGP trompeuse).

`docs/roadmap.md` mis à jour pour refléter l'état réel (Phases 0-4 terminées et validées, section "Reste à faire" pour les finitions non bloquantes restantes).

**Entrées clés :**

- [BDR-005](decisions/BDR-005.md) — Valider les frontières réseau même sans auth (LAN)
- [ZBLK-002](archive/blockers/ZBLK-002.md) — `scale()` invalide → écran de veille noir
- [ZBLK-003](archive/blockers/ZBLK-003.md) — Écran de veille à moitié largeur sur la vraie TV
- [ZBLK-004](archive/blockers/ZBLK-004.md) — Purge d'historique git (IP Tailscale committée)
- [ZBLK-005](archive/blockers/ZBLK-005.md) — Aucun toolchain Android disponible en CLI

## 2026-09-06

Poursuite et finalisation du travail WigggleUI entamé la veille : ajout de 14 widgets supplémentaires (horloges multi-fuseaux configurables, calendriers, météo), traduction complète en français, et refonte du système de positionnement — abandon du drag & drop libre en pixels au profit d'une grille façon écran d'accueil Android (taille fixe par widget, snap à la case la plus proche). Plusieurs allers-retours nécessaires en cours de route : le drag ne s'accrochait pas du tout à la grille (`dragGrid` de `react-rnd` peu fiable une fois combiné au `transform: scale()` du canevas réduit), un clic natif se déclenchait après chaque drag et ouvrait le panneau de réglages à tort, et l'overlay de grille est resté invisible sur plusieurs itérations avant de trouver les deux vraies causes (traits sous-pixel sous `scale()`, et trait de bord droit/bas jamais dessiné par le motif en dégradé tuilé). Ajout d'une marge et d'un espacement entre les widgets, retrait de la bordure autour de l'écran simulé, et correction des coins arrondis — mal placés à deux reprises avant de comprendre que la demande portait sur le canevas (l'écran simulé), pas sur les widgets ni sur le sélecteur de la palette. Nettoyage d'une dépendance npm parasite (`cn`) et d'un paquet Radix inutilisé (`@radix-ui/react-separator`), tous deux introduits silencieusement par un bug du CLI shadcn. Commit `✨ (Widgets)` créé via `/gen-commit`, puis `CHANGELOG.md` initialisé (format Keep a Changelog) à partir de l'historique complet du repo.

**Entrées clés :**

- [BDR-007](decisions/BDR-007.md) — Grille façon écran d'accueil Android
- [BDR-010](decisions/BDR-010.md) — Garder les primitives du projet face à un registre tiers divergent
- [BLK-006](blockers/BLK-006.md) — Le drag ne s'accrochait pas à la grille
- [BLK-008](blockers/BLK-008.md) — Grille invisible, deux causes CSS cumulées
