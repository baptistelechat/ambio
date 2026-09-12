---
id: ZBLK-010
type: blocker
date: 2026-09-12
tags: [mobile, drawer, vaul, dvh, debugging]
---

# ZBLK-010 — Bouton "Publier" inaccessible dans le tiroir de réglages mobile

| Friction                                                                                                                                                                                         | Cause réelle                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Solution                                                                                                                                                                                                      | Statut |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Le contenu du tiroir mobile (`vaul`) débordait toujours vers le bas, rendant le séparateur et le bouton "Publier" invisibles/inatteignables — persistant après plusieurs corrections successives | Trois fausses pistes avant la vraie cause : (1) `max-h-[90dvh]` sur `DrawerContent` faisait _disparaître le tiroir entièrement_ (casse le calcul de snap de `vaul`, qui mesure la hauteur réelle du conteneur) ; (2) passer `OPEN_SNAP` de 0.9 à 1 réglait le souci en émulation Chrome DevTools mais pas sur le vrai téléphone de Baptiste ; (3) vraie cause : `h-full` (`height:100%`) sur le `DrawerContent` `position:fixed` se résout via la "large viewport" (barre d'adresse masquée par hypothèse), pas la hauteur réellement visible sur Android Chrome — voir [LRN-012](../../learnings/LRN-012.md) | Remplacer `h-full` par `h-dvh` sur `DrawerContent`, et le `h-full` du wrapper `Palette` (qui ignorait l'espace pris par la poignée du tiroir) par `flex-1 min-h-0`, cohérent avec le reste de la cascade flex | résolu |

## Références

- [LRN-012](../../learnings/LRN-012.md) — pattern CSS extrait de ce blocage
- [BDR-014](../../decisions/BDR-014.md) — réorganisation de l'écran où ce bug a été découvert
