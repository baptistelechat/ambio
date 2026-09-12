---
id: ZBLK-006
type: blocker
date: 2026-09-06
tags: [react-rnd, scale, drag-drop, grid-snap]
---

# ZBLK-006 — Le drag ne s'accrochait pas du tout à la grille

| Friction                                                                                                                                                                                                                                                                        | Cause réelle                                                                                                                                                                     | Solution                                                                                                                                                               | Statut |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| En déplaçant un widget dans l'éditeur, il retombait parfois à une position complètement hors-grille au lieu de se caler sur la case la plus proche — reproduit et confirmé via inspection directe du `transform` appliqué (`768.72px`, pas un multiple de la taille de cellule) | Le prop `dragGrid` de `react-rnd` ne snap pas correctement une fois combiné au `transform: scale()` du conteneur parent (canevas réduit pour tenir dans la fenêtre de l'éditeur) | Retirer `dragGrid`, calculer soi-même la case arrondie dans `onDragStop`, et forcer visuellement cette position via l'API impérative `rndRef.current.updatePosition()` | résolu |

## Références

- [LRN-006](../../learnings/LRN-006.md) — pattern généralisé depuis ce blocage
- [BDR-007](../../decisions/BDR-007.md) — décision produit qui a introduit ce besoin de grille
