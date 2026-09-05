---
id: ZBLK-002
type: blocker
date: 2026-09-05
tags: [css, transform, scale, screensaver]
---

# ZBLK-002 — `scale(min(100vw/1920,...))` invalide → écran de veille vide/noir

| Friction                                                                                                      | Cause réelle                                                                                                                                                                                                                                                                                          | Solution                                                                                                                                                               | Statut |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `/screensaver` s'affichait entièrement noir, aucun widget visible, malgré une config publiée avec des widgets | `transform: scale(min(100vw / 1920, 100vh / 1080))` est une déclaration CSS invalide (`scale()` attend un nombre, pas la longueur produite par `min()`/`vw`/`vh`) — le navigateur ignorait silencieusement toute la règle `transform`, laissant le canvas à sa taille logique (1920×1080) non réduite | Calculer l'échelle en JS via un hook `useFullscreenScale` (`window.innerWidth/innerHeight`, écoute `resize`) et l'injecter comme nombre pur dans `transform: scale(N)` | résolu |

## Références

- [LRN-002](../../learnings/LRN-002.md) — pattern CSS généralisé depuis ce blocage
