# Backlog d'idées de widgets

## Contexte

Liste vivante d'idées de widgets pour l'écran de veille, à trier et prioriser
au fil de l'eau. Complète la section "Widgets — vague 2" de `roadmap.md`
(match ESPC Champagné 72, fil RSS, anniversaires du jour) sans la dupliquer.

Chaque idée est notée avec sa source de données et un effort estimé, pour
faciliter le tri lors d'une prochaine session de dev.

## Légende effort

| Effort | Signification                                                               |
| ------ | --------------------------------------------------------------------------- |
| Faible | Pas d'API externe, ou API déjà utilisée dans le projet (Open-Meteo, ICS)    |
| Moyen  | Nouvelle API publique gratuite à intégrer, sans authentification complexe   |
| Élevé  | Authentification (OAuth) ou dépendance à une infra externe (Home Assistant) |

## Idées

| Widget                         | Description                                                            | Source de données                                                                  | Effort |
| ------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------ |
| Compte à rebours               | Jours restants avant une date cible (vacances, échéance, anniversaire) | Aucune — date saisie dans les réglages du widget                                   | Faible |
| Anniversaires proches          | Liste des prochains anniversaires (J-7)                                | Réutilise l'infra ICS déjà en place pour le widget Agenda (`icsUrl`)               | Faible |
| QR code                        | QR vers le Wi-Fi invité ou une URL perso                               | Génération locale (lib `qrcode`), pas d'API                                        | Faible |
| Phase lunaire                  | Icône + pourcentage de la lune actuelle                                | Calcul local (formule astronomique), pas d'API                                     | Faible |
| Message personnalisé           | Texte qui change selon l'heure ("Bonne soirée Baptiste")               | Config statique + horloge locale                                                   | Faible |
| Fête du jour                   | Prénom fêté aujourd'hui                                                | Liste locale statique, même pattern que le widget Proverbe                         | Faible |
| Qualité de l'air / pollen / UV | Extension du widget météo existant                                     | Open-Meteo Air Quality API (même fournisseur que le widget météo actuel, sans clé) | Faible |
| Statut Raspberry Pi            | Température CPU, uptime du RPi qui héberge Ambio                       | Lecture locale côté serveur Vite (pas d'API externe)                               | Faible |
| Notes libres                   | Post-it texte modifiable depuis l'éditeur                              | Texte stocké directement dans `config.json`                                        | Faible |
| Marée (côte vendéenne)         | Horaires de marée haute/basse                                          | API marée à identifier (SHOM ou équivalent) — à vérifier si accès gratuit sans clé | Moyen  |
| Vigilance météo                | Niveau de vigilance Météo-France pour la Vendée                        | API Météo-France vigilance (ouverte) — à vérifier                                  | Moyen  |
| Prix des carburants            | Prix essence/gazole à la station la plus proche                        | API data.gouv.fr "Prix des carburants" (ouverte, gratuite)                         | Moyen  |
| Cours bourse / crypto          | Valeur d'un ou plusieurs actifs suivis                                 | API publique gratuite (ex. CoinGecko pour crypto, sans clé)                        | Moyen  |
| Musique en cours (Spotify)     | Titre/artiste en cours de lecture                                      | API Spotify — nécessite OAuth                                                      | Élevé  |
| Domotique Home Assistant       | Statut d'un capteur/pièce (température, ouverture...)                  | API/WebSocket Home Assistant local — dépend d'une install HA existante             | Élevé  |

## Idées supplémentaires (2e passe)

Deuxième passage de brainstorm, orienté API publiques françaises/européennes
ouvertes sans clé et petits clins d'œil dev.

| Widget                            | Description                                                                     | Source de données                                                                                                                                                                 | Effort |
| --------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Jours fériés & vacances scolaires | Prochain jour férié ou statut vacances/école (zone B, académie de Nantes)       | [calendrier.api.gouv.fr](https://calendrier.api.gouv.fr/jours-feries/metropole/{annee}.json) (jours fériés) + API vacances scolaires data.education.gouv.fr — gratuites, sans clé | Faible |
| Lever/coucher du soleil           | Heure de lever, coucher et durée du jour restante, avec barre de progression    | Open-Meteo (`daily.sunrise`/`sunset`) — même fournisseur que le widget météo actuel                                                                                               | Faible |
| Semaine & jour de l'année         | Numéro de semaine ISO + "jour X/365"                                            | Calcul local (`Date` + règle ISO-8601)                                                                                                                                            | Faible |
| Éphéméride "Ce jour-là"           | Un événement historique ou une naissance célèbre associée à la date du jour     | API Wikipedia [On This Day](https://fr.wikipedia.org/api/rest_v1/feed/onthisday/events/{mm}/{dd}) — sans clé                                                                      | Moyen  |
| Mix électrique français           | % nucléaire/renouvelable et intensité carbone du réseau en direct               | API opendata RTE [éCO2mix](https://www.rte-france.com/eco2mix) — gratuite, sans clé                                                                                               | Moyen  |
| Vigilance crues                   | Niveau d'alerte (vert/jaune/orange/rouge) des rivières vendéennes proches       | API [Vigicrues](https://www.vigicrues.gouv.fr/services-api.php) — service public, sans clé                                                                                        | Moyen  |
| Activité GitHub du jour           | Dernier commit/push public, streak de contribution                              | API REST GitHub `/users/{user}/events/public` — sans authentification (60 req/h)                                                                                                  | Moyen  |
| Téléchargements npm               | Compteur de téléchargements (jour/semaine) d'un package perso                   | API [api.npmjs.org/downloads](https://api.npmjs.org/downloads/point/last-day/{package}) — gratuite, sans clé                                                                      | Faible |
| Qualité de l'eau de baignade      | Statut des plages vendéennes (bonne/moyenne/mauvaise), saisonnier               | API "Info Baignade" (data.gouv.fr / ARS) — format à valider                                                                                                                       | Moyen  |
| Code HTTP du jour                 | Un code de statut HTTP tiré au sort avec sa signification — private joke de dev | Calcul local (liste statique intégrée)                                                                                                                                            | Faible |

## Pistes à creuser avant de trancher

- **Marée** : identifier une API réellement gratuite et sans clé (le SHOM
  impose parfois une inscription) avant de committer sur ce widget.
- **Vigilance météo** : vérifier le format exact et la stabilité de l'API
  publique Météo-France (pas toujours documentée officiellement).
- **Home Assistant** : pertinent uniquement si une instance tourne déjà chez
  Baptiste — à confirmer avant de scoper.
- **Spotify** : le refresh OAuth ajoute de la complexité (stockage de
  tokens côté RPi) — à peser face à l'usage réel (écran de veille, pas
  forcément le bon endroit pour du "now playing").
- **Vacances scolaires** : plusieurs formats d'API concurrents (dataset
  data.education.gouv.fr vs API tierce plus simple type
  `api-vacances-scolaires`) — à comparer avant d'implémenter.
- **Info Baignade** : API moins stable/documentée que Vigicrues ou
  éCO2mix — à valider concrètement avant de s'engager dessus.

## Prochaine étape suggérée

Démarrer par 2-3 idées "Faible" sans dépendance externe pour valider vite :
compte à rebours, QR code et phase lunaire restent de bons candidats — aucun
appel réseau, juste du calcul local, cohérent avec le reste du projet
(widgets `wiggle*` déjà 100% client-side). Le code HTTP du jour et le numéro
de semaine ISO sont dans la même veine si une touche "private joke de dev"
te tente.
