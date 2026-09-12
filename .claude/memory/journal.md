---
register: journal
---

## 2026-09-05

Initialisation de l'infrastructure mémoire agent (`/memory-setup`) sur le projet Ambio. Pas de `.claude/memory/` ni de `CLAUDE.md` préexistants — création du contexte projet et des 5 registres à partir de l'état réel du dépôt (README, `docs/`, `rpi-app/package.json`) : projet perso d'écran de veille custom pour TV TCL (RPi + app Android), pas encore initialisé en dépôt git.

**Entrées clés :**

- [BDR-001](decisions/BDR-001.md) — WebSocket de sync sur `/ws`
- [BDR-002](decisions/BDR-002.md) — IP du RPi en dur dans l'app Android
- [LRN-001](learnings/LRN-001.md) — `react-rnd` contrôlé fige le drag sous React 19
- [ZBLK-001](archive/blockers/ZBLK-001.md) — Freeze du drag & drop résolu

---

Construction complète du projet de A à Z en autonomie : `rpi-app` (Vite + React 19, éditeur drag & drop + rendu `/screensaver` + API config/upload/agenda + WebSocket) et `android-app` (Kotlin, `MyDreamService` + `MainActivity`), déployés et validés en conditions réelles. RPi mis en production via `pm2` (déplacé de `~/ambio` vers `~/Documents/ambio` en cours de route pour respecter la convention du reste des projets sur la machine). Une revue de sécurité automatique a détecté un SSRF sur `/api/agenda` et un risque XSS/upload arbitraire sur `/api/upload` — corrigés (allowlist d'extensions, validation de protocole d'URL).

Repo git créé et poussé sur GitHub (`baptistelechat/ambio`) — un premier commit contenait par erreur l'IP Tailscale et le user SSH (générés par un skill readme-writer externe), nécessitant une purge complète de l'historique (branche orpheline, commandes lancées par l'utilisateur via `!` car le classificateur de sécurité de Claude Code refusait de les exécuter directement, même après confirmation). RPi resynchronisé sur le nouvel historique.

Deux bugs de rendu distincts découverts et corrigés en testant sur la vraie TV : un `transform: scale()` invalide (unités `vw`/`vh` passées à une fonction qui attend un nombre) rendait `/screensaver` totalement noir ; puis, une fois corrigé, l'écran de veille s'affichait à moitié largeur sur la TV à cause d'un `flex-shrink` par défaut réduisant un canvas pourtant dimensionné explicitement. Ce second bug n'a pu être diagnostiqué qu'en déboguant la WebView Android à distance via le protocole DevTools brut (`adb forward` + websocket + `Runtime.evaluate`), `chrome://inspect` n'étant pas accessible depuis l'outil d'automatisation du navigateur utilisé dans cette session.

Mise en place de l'autonomie de build Android : aucun SDK/Gradle/Android Studio n'était disponible en ligne de commande au départ. Une fois Android Studio installé et synchronisé une première fois par l'utilisateur, réutilisation de sa distribution Gradle mise en cache pour générer et committer le wrapper (`gradlew`), et écriture d'un script `build-and-install.sh` (compile + `adb install` en une commande), en forçant `JAVA_HOME` sur le bon JDK (le système pointait vers un JDK 8 obsolète, cause d'une erreur Gradle/AGP trompeuse).

`docs/roadmap.md` mis à jour pour refléter l'état réel (Phases 0-4 terminées et validées, section "Reste à faire" pour les finitions non bloquantes restantes).

**Entrées clés :**

- [BDR-005](decisions/BDR-005.md) — Valider les frontières réseau même sans auth (LAN)
- [ZBLK-002](archive/blockers/ZBLK-002.md) — `scale()` invalide → écran de veille noir
- [ZBLK-003](archive/blockers/ZBLK-003.md) — Écran de veille à moitié largeur sur la vraie TV
- [ZBLK-004](archive/blockers/ZBLK-004.md) — Purge d'historique git (IP Tailscale committée)
- [ZBLK-005](archive/blockers/ZBLK-005.md) — Aucun toolchain Android disponible en CLI

## 2026-09-06

Poursuite et finalisation du travail WigggleUI entamé la veille : ajout de 14 widgets supplémentaires (horloges multi-fuseaux configurables, calendriers, météo), traduction complète en français, et refonte du système de positionnement — abandon du drag & drop libre en pixels au profit d'une grille façon écran d'accueil Android (taille fixe par widget, snap à la case la plus proche). Plusieurs allers-retours nécessaires en cours de route : le drag ne s'accrochait pas du tout à la grille (`dragGrid` de `react-rnd` peu fiable une fois combiné au `transform: scale()` du canevas réduit), un clic natif se déclenchait après chaque drag et ouvrait le panneau de réglages à tort, et l'overlay de grille est resté invisible sur plusieurs itérations avant de trouver les deux vraies causes (traits sous-pixel sous `scale()`, et trait de bord droit/bas jamais dessiné par le motif en dégradé tuilé). Ajout d'une marge et d'un espacement entre les widgets, retrait de la bordure autour de l'écran simulé, et correction des coins arrondis — mal placés à deux reprises avant de comprendre que la demande portait sur le canevas (l'écran simulé), pas sur les widgets ni sur le sélecteur de la palette. Nettoyage d'une dépendance npm parasite (`cn`) et d'un paquet Radix inutilisé (`@radix-ui/react-separator`), tous deux introduits silencieusement par un bug du CLI shadcn. Commit `✨ (Widgets)` créé via `/gen-commit`, puis `CHANGELOG.md` initialisé (format Keep a Changelog) à partir de l'historique complet du repo.

**Entrées clés :**

- [BDR-007](decisions/BDR-007.md) — Grille façon écran d'accueil Android
- [BDR-010](decisions/BDR-010.md) — Garder les primitives du projet face à un registre tiers divergent
- [ZBLK-006](archive/blockers/ZBLK-006.md) — Le drag ne s'accrochait pas à la grille
- [ZBLK-008](archive/blockers/ZBLK-008.md) — Grille invisible, deux causes CSS cumulées

## 2026-09-07

Intégration du composant `<Grainient />` de React Bits comme troisième option de fond d'écran (à côté de image/vidéo) : rendu dégradé animé WebGL (`ogl`), sélectionnable dans l'éditeur via un `Select` listant 8 presets de couleurs curés à la main (Aurore, Coucher de soleil, Nébuleuse, Océan, Braise, Forêt, Minuit, Bonbon), chacun avec un petit cercle de prévisualisation en `linear-gradient` CSS directement dans le menu déroulant. Deux bugs WebGL non-évidents rencontrés et corrigés en testant en direct dans le navigateur : le canvas ne remplissait qu'un coin du conteneur scalé (double application du `transform:scale()` via le `setSize()` d'`ogl`), puis un changement de preset ne se voyait pas tant que la boucle `requestAnimationFrame` restait en pause. Commit `✨ (Wallpaper)` créé via `/gen-commit` après un premier message rejeté (scope et bullets pas assez clairs) — regénéré avec un scope "Wallpaper" et des puces plus factuelles, accepté au second essai. `CHANGELOG.md` mis à jour avec l'entrée utilisateur correspondante.

**Entrées clés :**

- [BDR-011](decisions/BDR-011.md) — Fond dégradé : presets curés plutôt qu'un color picker libre
- [ZBLK-009](archive/blockers/ZBLK-009.md) — Grainient mal affiché dans le canevas scalé de l'éditeur
- [LRN-010](learnings/LRN-010.md) — Canvas WebGL sous `transform:scale()` : double réduction + peinture figée

## 2026-09-12

Comparaison des `vite.config.ts` de deux autres projets persos (ifecho, pawzzle) pour identifier les plugins Vite jugés incontournables et candidats à une adoption systématique. Retenu : `vite-plugin-checker` (erreurs TS/lint live), `vite-plugin-qrcode` (accès mobile via QR code) et `vite-plugin-mkcert` (HTTPS auto-signé en dev) — `vite-plugin-pwa` écarté du défaut, pertinent seulement quand un projet a réellement besoin d'un manifest/service worker installable (pas le cas d'Ambio, chargé en WebView Android via `DreamService`). Installés dans `rpi-app`, validés par lint (`oxlint`, 0 nouvelle erreur) et build (`tsc -b && vite build`, OK), puis vérifiés en conditions réelles dans le Browser pane après redémarrage du dev server (bascule HTTPS confirmée, éditeur fonctionnel sans erreur console). `.claude/launch.json` mis à jour en conséquence (`url: https://localhost:5173`).

Le skill global `project-init` (hors dépôt, `~/.claude/skills/project-init/SKILL.md`) a reçu une nouvelle étape de détection Vite + installation automatique de ces 3 plugins, pour que ce choix se propage aux futurs projets sans devoir le refaire à la main à chaque fois.

**Entrées clés :**

- [BDR-012](decisions/BDR-012.md) — Adoption des 3 plugins Vite incontournables dans rpi-app
- voir aussi GBDR-011 et GLRN-277/GLRN-278 (mémoire globale, hors dépôt)

---

Rendu l'éditeur mobile pivoté entièrement interactif : jusqu'ici l'aperçu plein écran pivoté à 90° (`RotatedPreview`) n'affichait qu'un rendu passif (`StaticGrid`, juste un `onClick` de sélection) — impossible d'y déplacer un widget sans passer par un ordinateur. Écriture d'un drag maison en Pointer Events (`RotatedGrid.tsx`) qui reconvertit le delta écran en delta local via l'inverse de la matrice de rotation à 90°, car `react-rnd` ne compense qu'un `scale`, jamais une rotation d'ancêtre. Logique de snap en grille (`snapToGrid`/`gridToPixels`) et l'overlay de grille (`GridOverlay`) extraits dans des utilitaires partagés, réutilisés côté desktop (`Canvas.tsx`) pour éliminer la duplication déjà présente. Vérifié directement dans le Browser pane en émulation mobile : le sens du drag suit fidèlement le doigt sur les deux axes, tap vs drag correctement distingués, comportement desktop inchangé.

À la demande de Baptiste, le panneau de réglages du tiroir mobile réorganisé en deux onglets ("Widget" / "Fond") avec des icônes Lucide, pour remplacer le long panneau à défiler. Deux allers-retours de debug non triviaux ensuite, le bouton "Publier" restant invisible/inatteignable malgré les changements : un premier correctif (`max-h-[90dvh]` sur le `DrawerContent`) a fait disparaître le tiroir entièrement (cassait le calcul de snap de `vaul`), un second (`OPEN_SNAP` 0.9→1) réglait le problème en émulation Chrome DevTools mais pas sur le vrai téléphone Android de Baptiste — obligeant à relancer un second serveur de test local (HTTPS, via `vite-plugin-mkcert` alors encore présent) pour investiguer avec de vrais DevTools plutôt que de deviner. Cause réelle trouvée par inspection DOM complète (`getBoundingClientRect`/`getComputedStyle` à chaque niveau) : `height:100%` sur le `DrawerContent` `position:fixed` se résout via la "large viewport" (barre d'adresse mobile supposée masquée), pas la hauteur réellement visible sur Android Chrome — corrigé en `h-dvh`. Au passage, le CLI shadcn a reproduit à l'identique le bug déjà documenté dans [ZBLK-007](archive/blockers/ZBLK-007.md) (alias `@/` mal résolu sous Windows + composant tiré depuis Base UI au lieu de Radix) en installant `tabs` — nettoyé manuellement, pas de nouvelle entrée.

Suite à ce debug, Baptiste a signalé que `vite-plugin-mkcert` (adopté la veille dans la même journée, [BDR-012](decisions/BDR-012.md)) cassait la publication live vers la TV : le plugin bascule Vite entièrement en HTTPS, rendant `RPI_URL` (codé en dur en `http://` dans `MyDreamService.kt`) injoignable. Retiré proprement (plugin + dépendance + `pnpm install`) plutôt que d'adapter le WebView Android pour accepter des certificats auto-signés.

Langue de la page (`index.html`) déclarée en `fr` pour éviter l'invite de traduction du navigateur. Session close avec `react-doctor --scope changed` (aucune régression) puis commit + push (`📱 (Editor)`).

**Entrées clés :**

- [BDR-013](decisions/BDR-013.md) — Retrait de `vite-plugin-mkcert` peu après son adoption
- [BDR-014](decisions/BDR-014.md) — Éditeur mobile en onglets Widget/Fond
- [ZBLK-010](archive/blockers/ZBLK-010.md) — Bouton Publier inaccessible dans le tiroir mobile
- [LRN-012](learnings/LRN-012.md) — `height:100%` sur `position:fixed` ignore la barre d'adresse mobile

---

Ajout d'un aperçu (ghost) rouge translucide affichant la case de grille cible pendant le déplacement d'un widget dans l'éditeur, à la demande de Baptiste. Une fois construit et vérifié, Baptiste a signalé que le drag était devenu lent — diagnostic : l'état du ghost, levé au `Canvas` pour rester visible au-dessus des widgets, re-render tous les widgets frères à chaque frame de drag. Corrigé en gardant l'état local à chaque `GridWidget` et en projetant le ghost via `createPortal` dans un conteneur stable. Baptiste a ensuite demandé d'annuler toute la fonctionnalité (`git checkout`) pour se concentrer uniquement sur l'ajout de nouveaux widgets — le pattern de correction reste capturé pour une réintroduction future.

Brainstorm de 25 idées de widgets, écrit dans `docs/widget-ideas.md` (backlog structuré par effort estimé et source de données), après recherche des vraies APIs disponibles plutôt que des suppositions.

Implémentation de 8 nouveaux widgets WigggleUI à partir de ce backlog, avec plusieurs allers-retours de raffinement demandés par Baptiste : QR code (Wi-Fi ou URL, `react-qr-code`), Fête du jour, Statut Raspberry Pi (température CPU + uptime, nouvel endpoint `/api/system-status` vérifié directement en SSH sur le vrai RPi), et une suite Qualité de l'air (AQI, UV, Pollen, Particules fines PM2.5, plus une vue combinée 6x1). Le widget "Fête du jour" a d'abord utilisé l'API Nominis, qui s'est révélée renvoyer le calendrier liturgique officiel plutôt que le calendrier civil usuel (ex: "Le saint nom de Marie" au lieu d'"Apollinaire" le 12/09) — remplacée par `nameday.abalin.net` après vérification. Plusieurs itérations de style demandées : tailles d'icônes alignées sur celles de la météo, couleur d'icône `stroke-gray-400` (pas `stroke-muted-foreground`), mise en page "Fête du jour" (icône centrée, nom en pied de widget), et le widget Qualité de l'air éclaté en 4 widgets unitaires + 1 vue combinée après un premier essai en 4x2 jugé trop dense (passé en 6x1, indices sur 100 affichés explicitement). Deux bugs préexistants découverts et corrigés au passage : les horloges numériques (`clock-01/02/03`) affichaient l'heure en 12h au lieu de 24h, et le widget "Météo détaillée" désalignait ses colonnes (ressenti/humidité) à cause de deux lignes flex indépendantes au lieu d'une grille CSS. Palette de l'éditeur réorganisée en sous-catégories (Horloges, Calendriers, Météo, Qualité de l'air, Système, Utilitaires) vu le nombre de widgets WigggleUI passé à 25.

Session close : `react-doctor --scope changed` (score 83/100, 2 faux positifs identifiés — `isLoading` déjà remis à `false` dans un `finally`, juste gardé derrière un flag d'annulation — et la complexité du switch de `WidgetRenderer.tsx`, un pattern déjà existant avant cette session), puis commit + push (`✨ (Widgets)`).

**Entrées clés :**

- [BDR-015](decisions/BDR-015.md) — `react-qr-code` (SVG) pour le widget QR code
- [BDR-016](decisions/BDR-016.md) — `abalin.net` (civil) plutôt que Nominis (liturgique) pour la fête du jour
- [BDR-017](decisions/BDR-017.md) — Qualité de l'air éclatée en widgets unitaires + vue combinée
- [BDR-018](decisions/BDR-018.md) — Palette WiggleUI sous-catégorisée par thème
- [ZBLK-011](archive/blockers/ZBLK-011.md) — Drag lent après ajout du ghost de preview
- [LRN-015](learnings/LRN-015.md) — État de drag transitoire : local + `createPortal`, pas levé au parent

## 2026-09-12

Déploiement du dernier commit sur le Raspberry Pi (`git pull` + `pnpm install` + `pm2 restart`) pour tester en conditions réelles le widget "Statut Raspberry Pi" ajouté en session précédente. URL Tailscale du RPi communiquée à Baptiste (`100.69.48.35`, user `batmat`). Le redémarrage pm2 a d'abord échoué en boucle (`Cannot find package 'vite-plugin-checker'`) malgré une installation réussie — cause : cache de pré-bundling Vite (`node_modules/.vite-temp`) resté périmé après l'ajout de nouveaux plugins sur un process déjà lancé, corrigé par purge complète avant redémarrage. `/api/system-status` vérifié en direct par `curl` SSH : données matérielles réelles remontées (température, uptime).

Copie du `config.json` local (layout de widgets) vers le RPi, avec sauvegarde de l'ancienne config avant écrasement.

Extension du widget statut RPi à la demande de Baptiste : discussion sur les métriques disponibles au-delà de la température (RAM, charge CPU, détection de sous-tension via `vcgencmd get_throttled`), aller-retour sur le format (6x1 → 4x1) et le nombre de métriques (5 → 3) après que Baptiste a signalé une confusion sur "Charge" (compris comme charge de batterie sur un appareil pourtant toujours branché) — périmètre final réduit à température/RAM/uptime. L'ancien widget carré `wiggleSystemStatus1` entièrement retiré (remplacé par `wiggleSystemStatusMd1`, format barre compacte). Au passage, extraction du composant `InfoItem` (dupliqué 3x entre `air-quality-md-01`, `weather-md-01` et le nouveau widget) en composant partagé avec variant `cva` (`row`/`stack`), migrant les 2 usages existants sans régression visuelle (vérifiée lint + build + Browser pane).

Session close avec une contrainte inhabituelle : le repo était modifié en parallèle par une autre session de travail (feature bandeau d'actualités) sur les mêmes fichiers que ceux touchés (`types.ts`, `screensaverPlugin.ts`). Staging classique (`git add -A`) écarté à la demande de Baptiste au profit d'un staging précis limité aux seuls fichiers de cette session — `git rm --cached` + `git add -u` s'est révélé insuffisant sur les fichiers mixtes ("pathspec did not match"), résolu par reconstruction du contenu ciblé (HEAD + transformations connues) et injection directe dans l'index via `git hash-object -w` + `git update-index --cacheinfo`, sans toucher au working tree (pour ne pas écraser le travail en cours de l'autre session). `react-doctor --scope changed` a remonté 2 signalements, tous deux hors du périmètre stagé (code du bandeau d'actualités, complexité pré-existante du switch `WidgetRenderer`) — aucune action nécessaire. Commit + push (`✨ (Widgets)`).

**Entrées clés :**

- [BDR-019](decisions/BDR-019.md) — Widget statut RPi limité à 3 métriques
- [LRN-018](learnings/LRN-018.md) — Extraction InfoItem via variant `cva` à la 3e duplication
- [ZBLK-012](archive/blockers/ZBLK-012.md) — Cache Vite périmé après `pnpm install` sur pm2
- [ZBLK-013](archive/blockers/ZBLK-013.md) — Staging git ciblé sur fichier édité en parallèle
- voir aussi GLRN-279 et GLRN-280 (mémoire globale, hors dépôt)

---

Session sur le widget bandeau d'actualités (news ticker), enchaînant plusieurs demandes successives de Baptiste. Remplacement de la saisie libre d'URL RSS par des cases à cocher sur un catalogue curé côté serveur (18 flux, 7 thèmes de mots-clés) — choix qui ferme au passage un vecteur SSRF (le serveur ne résout plus que des ids connus, jamais une URL fournie par le client). Largeur du widget rendue réglable (4-16 colonnes) via un slider, avec mise à jour en direct pendant le glisser plutôt qu'au relâchement seulement. Style du widget aligné sur celui des autres widgets WigggleUI (carte blanche) et déplacé dans une nouvelle sous-catégorie "Actualités" de la palette, à la demande de Baptiste.

Deux bugs réels découverts en testant sur la vraie TV : la largeur réglée dans l'éditeur n'était pas appliquée sur le rendu réel (`StaticGrid`/`RotatedGrid` ne lisaient que la taille fixe par type, oubliée lors de l'ajout de la largeur réglable) ; et élargir un widget le faisait glisser vers la gauche au lieu de simplement s'étendre à droite (le code recalculait la colonne au lieu de plafonner la largeur disponible). Une dépêche syndiquée sur deux flux pouvait aussi apparaître deux fois (déduplication par lien ajoutée côté serveur).

Baptiste a ensuite signalé que le bandeau restait saccadé sur la TV malgré ces correctifs, ce qui a déclenché une investigation plus large. Connexion directe à la TV via `adb` (débogage réseau déjà activé, IP retrouvée par un scan ARP + tentatives de connexion sur les hôtes candidats). Au passage, découverte que "Économiseur d'écran" ne relançait pas Ambio de façon fiable — plusieurs fausses pistes explorées (réglage système soi-disant perdu, état "stopped" d'un second profil qui s'est avéré être un profil professionnel désactivé, déclenché par erreur via une commande adb ciblant le mauvais profil et qu'il a fallu annuler auprès de Baptiste) avant de trouver la vraie cause via `adb logcat` : une restriction `APP_AUTO_START` propriétaire à TCL bloquant silencieusement le `bindService` du système. Corrigée par `appops set ... allow` et un mécanisme de réassignation automatique (`DreamRegistrar`/`BootReceiver`) pour que ça survive aux redémarrages et mises à jour futures.

Pour la saccade elle-même, mesure objective via `adb shell dumpsys gfxinfo` (technique découverte en cours de route) : ~80% de frames "janky" peu importe l'approche. Réduire le nombre d'items affichés n'a quasi rien changé (86%→80%). Tentative plus radicale : générer le bandeau comme une vidéo H.264 côté serveur (ffmpeg + `drawtext`, endpoint `/api/news-ticker.mp4`, cache disque avec TTL), sur l'hypothèse qu'un autre écran de veille lisant de la vidéo 4K (Aerial View) fluide sur la même TV prouvait l'existence d'un chemin matériel dédié à la vidéo. L'hypothèse s'est révélée fausse : le rendu vidéo était pire que le CSS selon Baptiste. À sa demande, l'intégralité de l'approche vidéo a été annulée (retour au bandeau DOM/CSS d'origine, avec juste le plafond d'items) et le sujet mis de côté pour une investigation future.

Session close avec `react-doctor --scope changed` (score 79/100, un vrai correctif appliqué — lookup O(n×m) remplacé par des `Set` — les 3 autres signalements vérifiés et jugés corrects tels quels dans leur contexte). Commit + push (`🚧 (News ticker)`, choisi par Baptiste plutôt que `✨` vu le problème de fluidité laissé ouvert).

**Entrées clés :**

- [BDR-020](decisions/BDR-020.md) — Largeur de widget pilotée par override d'instance
- [BDR-021](decisions/BDR-021.md) — Flux RSS résolus uniquement via un catalogue serveur
- [BDR-022](decisions/BDR-022.md) — Réassignation automatique du dream Android
- [LRN-019](learnings/LRN-019.md) — `dumpsys gfxinfo` pour objectiver une saccade Android
- [LRN-020](learnings/LRN-020.md) — Un service système peut échouer via un app-op OEM
- [LRN-021](learnings/LRN-021.md) — Une appli tierce fluide en vidéo n'implique pas qu'un `<video>` HTML le sera
- [BLK-014](blockers/BLK-014.md) — Bandeau d'actualités reste saccadé (ouvert)
- [BLK-015](blockers/BLK-015.md) — Écran de veille bloqué par `APP_AUTO_START` (résolu)
