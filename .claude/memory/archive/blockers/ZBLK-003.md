---
id: ZBLK-003
type: blocker
date: 2026-09-05
tags: [css, flexbox, android, webview, screensaver]
---

# ZBLK-003 — Écran de veille rendu à moitié largeur sur la vraie TV

| Friction                                                                                                                                                                                                                                                                                                                                                                                                  | Cause réelle                                                                                                                                                                                                                           | Solution                                                                                   | Statut |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------ |
| Sur la TV réelle (pas l'éditeur), le rendu du screensaver occupait environ la moitié de la largeur de l'écran, non centré, malgré un style inline `width: 1920px` correct sur le canvas mis à l'échelle. Deux fausses pistes explorées avant la bonne cause : réglages WebView (`useWideViewPort`/`loadWithOverviewMode`) et taille physique de la WebView Android (vérifiée correcte via CDP, 1920×1080) | Le canvas scalé était un enfant direct d'un conteneur `flex items-center justify-center` — `flex-shrink: 1` (défaut) réduisait sa largeur calculée à celle du conteneur sur l'axe principal, sans toucher la hauteur (axe transversal) | Ajouter `shrink-0` (Tailwind pour `flex-shrink: 0`) au canvas scalé dans `Screensaver.tsx` | résolu |

## Références

- [LRN-003](../../learnings/LRN-003.md) — pattern CSS généralisé depuis ce blocage
- [LRN-004](../../learnings/LRN-004.md) — technique de debug qui a permis de trouver la cause
