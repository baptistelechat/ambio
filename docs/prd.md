# PRD — Écran de veille personnalisé pour TV TCL

## 1. Contexte & problème

L'écran de veille natif (Mode Ambiant / Google Photos) de la TV TCL 43P635X1
(Android 11, série 2022 P635) est cassé de façon persistante et reproductible :
il affiche systématiquement 3 photos stock fixes, quel que soit le réglage
(source, compte, album). Diagnostic exhaustif effectué :

- Reconfiguration complète de Google Photos / Mode Ambiant → sans effet
- Vidage cache/données de l'app système (`com.google.android.apps.tv.dreamx`) → sans effet
- Test avec plusieurs sources (Google Photos, Galerie d'art) → comportement identique
- Reproduit sur plusieurs TV TCL différentes (pas un défaut d'une seule unité)
- Bug documenté dans la communauté (XDA, forums Google/Samsung) comme un problème
  connu et non résolu côté fabricant/Google depuis fin 2024, touchant plusieurs
  marques de Smart TV

**Conclusion** : le composant système n'est pas réparable côté utilisateur.
La solution retenue est de contourner entièrement le mécanisme natif avec un
écran de veille custom, en s'appuyant sur le fait que le système Android
accepte n'importe quel `DreamService` tiers comme fournisseur d'écran de veille.

## 2. Objectif produit

Remplacer l'écran de veille natif par un écran de veille personnalisé,
pilotable à distance, affichant un fond (image/vidéo) et des widgets
d'information utiles, avec une expérience de configuration simple type
"glisser-déposer" depuis un PC ou un téléphone.

## 3. Utilisateur cible

Utilisateur unique (Baptiste) — pas de multi-utilisateur, pas d'authentification
prévue dans le scope initial (réseau local uniquement).

## 4. Périmètre fonctionnel

### 4.1 In scope (v1)

| Fonctionnalité | Description |
|---|---|
| App Android TV | `DreamService` natif chargeant une WebView plein écran pointée vers le RPi |
| Icône d'app dédiée | Raccourci visible dans la liste des apps, redirige vers le menu système Daydream |
| Fallback hors-ligne | Image statique locale si le RPi est injoignable |
| Retry automatique | Re-tentative périodique de connexion au RPi pendant l'affichage du fallback, bascule auto si reconnexion |
| Éditeur visuel | Interface web (PC/mobile) type "vue TV" avec widgets déplaçables/redimensionnables |
| Widgets v1 | Météo, heure/date, proverbe du jour, agenda |
| Fond personnalisable | Upload d'image ou vidéo de fond depuis l'éditeur |
| Synchronisation live | Changement publié depuis l'éditeur → mise à jour de l'écran de veille sans redémarrage |
| Stockage config | Fichier JSON simple sur le RPi (pas de base de données) |

### 4.2 Out of scope (v1)

- Authentification / multi-utilisateur
- Accès distant hors réseau local (pas de VPN/exposition internet)
- Widgets "vague 2" (match ESPC, RSS, anniversaires) — à évaluer post-v1
- Application mobile dédiée (l'éditeur web suffit, responsive)
- Historique des configurations / undo-redo
- Analytics ou télémétrie

## 5. Exigences non fonctionnelles

| Exigence | Cible |
|---|---|
| Latence de détection RPi indisponible | ≤ 3 secondes (timeout du check HTTP) |
| Fréquence de retry en mode fallback | Toutes les 30 secondes |
| Délai de propagation d'un changement de config | Quelques secondes (via WebSocket, pas de polling) |
| Résilience réseau | La TV ne doit jamais rester bloquée sur un écran blanc/erreur — fallback systématique |
| Persistance post-reboot | La configuration `screensaver_components` doit survivre aux redémarrages TV sans réintervention manuelle |
| Performance rendu | Le rendu `/screensaver` doit rester fluide sur le SoC modeste de la TV (privilégier JS léger, éviter les frameworks lourds côté rendu) |

## 6. Architecture (résumé)

```
RPi (app Vite unique)
 ├─ "/"            → éditeur drag & drop (React + Tailwind/shadcn)
 └─ "/screensaver"  → rendu plein écran consommé par la TV

TV (app Android)
 ├─ MainActivity    → icône, redirige vers réglages système Daydream
 └─ MyDreamService  → WebView vers "/screensaver" + fallback + retry
```

Communication : HTTP (config + assets) + WebSocket (live sync), le tout sur
le réseau local, sans backend séparé (middleware intégré au serveur Vite).

## 7. Critères de succès (v1)

- [ ] L'écran de veille custom se déclenche de façon fiable après inactivité
- [ ] Le fallback s'affiche automatiquement si le RPi est coupé, sans crash ni écran figé
- [ ] La bascule fallback → RPi se fait automatiquement sans redémarrer la TV
- [ ] Un changement dans l'éditeur est visible sur la TV en moins de 10 secondes
- [ ] Les 4 widgets v1 (météo, heure, proverbe, agenda) affichent des données à jour
- [ ] Configuration utilisable et compréhensible depuis un téléphone (pas seulement PC)

## 8. Risques identifiés

| Risque | Impact | Mitigation |
|---|---|---|
| Fabricant pousse une MAJ qui revalide le mode ambiant natif au boot | Le réglage `screensaver_components` custom pourrait être écrasé | Vérifier périodiquement / documenter la commande de restauration ADB |
| Performance WebView limitée sur le SoC de la TV | Widgets lourds (vidéo de fond HD, animations complexes) pourraient laguer | Tester tôt avec du contenu réel, prévoir des fonds allégés si besoin |
| RPi hors ligne prolongé (maintenance, panne) | Écran de veille reste bloqué sur le fallback statique | Acceptable en v1 — pas de criticité, juste un fond moins riche |

## 9. Roadmap

Voir `roadmap.md` pour le détail des phases de développement et des tâches
techniques associées.
