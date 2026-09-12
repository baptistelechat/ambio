---
id: ZBLK-011
type: blocker
date: 2026-09-12
tags: [performance, drag-drop, re-render, canvas, react-rnd]
---

# ZBLK-011 — Drag devenu lent après l'ajout d'un aperçu (ghost) de la case cible

| Friction                                                                                                                                              | Cause réelle                                                                                                                                                                                                                                                                                                                                         | Solution                                                                                                                                                                                                                                                                                                                                                                                                                                                | Statut |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Après l'ajout d'un aperçu rouge de la case cible pendant le déplacement d'un widget, Baptiste a signalé que le drag était devenu perceptiblement lent | L'état du ghost (`dragPreview`) était levé au `Canvas` (parent commun de tous les widgets) pour rester visible au-dessus des autres — chaque frame de drag (`onDrag`, tirant en continu) déclenchait donc un re-render du `Canvas`, qui re-render TOUS les widgets frères (horloges, animations, intervals) même sans rapport avec le widget déplacé | État `preview` rendu local à chaque `GridWidget` (plus de state levé au `Canvas`), ghost affiché via `createPortal` dans un conteneur stable rendu une seule fois par `Canvas` — seul le widget déplacé re-render, plus jamais ses frères. Cette feature a ensuite été annulée (`git checkout`) à la demande de Baptiste pour se concentrer sur l'ajout de nouveaux widgets, mais le pattern de correction reste valable pour une réintroduction future | résolu |

## Références

- [LRN-015](../../learnings/LRN-015.md) — pattern général extrait de ce blocage
