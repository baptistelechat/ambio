---
id: ZBLK-013
type: blocker
date: 2026-09-12
tags: [git, staging, concurrent-editing, parallel-session]
---

# ZBLK-013 — Staging git impossible via `git add`/`git rm --cached` seuls sur un fichier édité en parallèle

| Friction                                                                                                                                                                                                                                                                                                                                                                                                       | Cause réelle                                                                                                                                                               | Solution                                                                                                                                                                                                                                                           | Statut |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| Baptiste a demandé de ne committer que les fichiers touchés dans cette session, mais `types.ts` et `screensaverPlugin.ts` mélangeaient mes changements avec ceux d'une autre session en cours (widget bandeau d'actualités) dans les mêmes fichiers — `git rm --cached` puis `git add -u <path>` échouait avec "pathspec did not match any files" (le chemin n'était plus dans l'index après le `rm --cached`) | `git add -p` (interactif) n'est pas fiable en usage scripté, et modifier directement le fichier du working tree aurait écrasé le travail non sauvegardé de l'autre session | Reconstruction du contenu ciblé (`git show HEAD:path` + application de mes seules transformations connues) dans un fichier temporaire, puis `git hash-object -w` + `git update-index --cacheinfo 100644,<sha>,<path>` — stage l'INDEX sans toucher au fichier réel | résolu |

## Références

- voir aussi GLRN-280 (mémoire globale, hors dépôt) pour la technique généralisable
