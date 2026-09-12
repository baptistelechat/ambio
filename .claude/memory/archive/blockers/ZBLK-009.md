---
id: ZBLK-009
type: blocker
date: 2026-09-07
tags: [webgl, ogl, grainient, transform-scale, canvas]
---

# ZBLK-009 — Grainient mal affiché dans le canevas scalé de l'éditeur (deux causes cumulées)

| Friction                                                                                                      | Cause réelle                                                                                                                                                                                                                                                                                                              | Solution                                                                                                                                                                               | Statut |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Le fond dégradé WebGL (Grainient) n'occupait qu'un coin du canevas, puis restait figé au changement de preset | 1) `ogl`'s `Renderer.setSize()` réécrit `canvas.style.width/height` en px déjà scalés (post `transform:scale()` de l'ancêtre) → le canvas se retrouve réduit deux fois. 2) La boucle `requestAnimationFrame` peut être en pause (hors champ / onglet masqué) : les nouveaux uniforms sont à jour mais rien ne les repeint | 1) Réimposer `canvas.style.width/height = '100%'` après chaque `renderer.setSize()`. 2) Forcer un `renderer.render()` immédiat après la mise à jour des uniforms, sans dépendre du RAF | résolu |

## Références

- [LRN-010](../../learnings/LRN-010.md) — pattern réutilisable extrait de ce blocage
- [BDR-011](../../decisions/BDR-011.md) — décision d'intégrer Grainient avec des presets curés
