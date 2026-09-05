---
register: journal
---

## 2026-09-05

Initialisation de l'infrastructure mémoire agent (`/memory-setup`) sur le projet Ambio. Pas de `.claude/memory/` ni de `CLAUDE.md` préexistants — création du contexte projet et des 5 registres à partir de l'état réel du dépôt (README, `docs/`, `rpi-app/package.json`) : projet perso d'écran de veille custom pour TV TCL (RPi + app Android), pas encore initialisé en dépôt git.

**Entrées clés :**

- [BDR-001](decisions/BDR-001.md) — WebSocket de sync sur `/ws`
- [BDR-002](decisions/BDR-002.md) — IP du RPi en dur dans l'app Android
- [LRN-001](learnings/LRN-001.md) — `react-rnd` contrôlé fige le drag sous React 19
- [BLK-001](blockers/BLK-001.md) — Freeze du drag & drop résolu
