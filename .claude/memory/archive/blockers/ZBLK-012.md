---
id: ZBLK-012
type: blocker
date: 2026-09-12
tags: [vite, cache, pm2, deployment, rpi]
---

# ZBLK-012 — Widget statut RPi ne démarrait plus après `pnpm install` sur le process pm2 déjà lancé

| Friction                                                                                                                                                                                                                           | Cause réelle                                                                                                                                                                                                            | Solution                                                                                                                                                       | Statut |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Après `git pull` + `pnpm install` (nouveaux plugins Vite) sur le RPi, `pm2 restart ambio-screensaver` échouait en boucle avec `Cannot find package 'vite-plugin-checker'` alors que `pnpm list` confirmait le paquet bien installé | Le cache de pré-bundling Vite (`node_modules/.vite-temp`, contenant une config compilée avant l'installation des nouveaux plugins) n'est pas invalidé automatiquement par un `pnpm install` sur un process déjà démarré | `rm -rf node_modules/.vite-temp node_modules/.vite` puis `pm2 restart` — API `/api/system-status` vérifiée en direct après (`curl`), données réelles remontées | résolu |

## Références

- voir aussi GLRN-279 (mémoire globale, hors dépôt) pour le pattern généralisable
