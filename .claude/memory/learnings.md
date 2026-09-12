---
register: learnings
---

## Index

| ID                              | Date       | Pattern observé                                                                       | Tags                                                                |
| ------------------------------- | ---------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [LRN-001](learnings/LRN-001.md) | 2026-09-05 | `react-rnd` en mode contrôlé fige le drag avec React 19                               | #react-rnd #react19 #drag-drop #controlled-components               |
| [LRN-002](learnings/LRN-002.md) | 2026-09-05 | `transform: scale()` exige un nombre pur, pas vw/vh                                   | #css #transform #scale #viewport-units                              |
| [LRN-003](learnings/LRN-003.md) | 2026-09-05 | Un flex item dimensionné peut être réduit sur l'axe principal (flex-shrink défaut)    | #css #flexbox #flex-shrink #layout                                  |
| [LRN-004](learnings/LRN-004.md) | 2026-09-05 | Debug WebView Android via CDP brut sans chrome://inspect                              | #android #webview #debug #cdp #adb                                  |
| [LRN-005](learnings/LRN-005.md) | 2026-09-05 | JAVA_HOME obsolète → erreur Gradle/AGP trompeuse                                      | #gradle #android #java #jdk #toolchain                              |
| [LRN-006](learnings/LRN-006.md) | 2026-09-06 | `react-rnd` `dragGrid` + `scale` : snap peu fiable, forcer via le ref                 | #react-rnd #scale #drag-drop #grid-snap #imperative-ref             |
| [LRN-007](learnings/LRN-007.md) | 2026-09-06 | Grille CSS en dégradé répété : dernier trait (bord droit/bas) manquant                | #css #linear-gradient #grid #box-shadow #tiling                     |
| [LRN-008](learnings/LRN-008.md) | 2026-09-06 | Traits fins (< 2px) invisibles sous un `transform: scale()` < 1                       | #css #transform-scale #sub-pixel #grid-lines                        |
| [LRN-009](learnings/LRN-009.md) | 2026-09-06 | Un `click` natif se déclenche toujours après un drag relâché                          | #react #drag-drop #click-event #event-handling                      |
| [LRN-010](learnings/LRN-010.md) | 2026-09-07 | Canvas WebGL (ogl) sous `transform: scale()` : double réduction + peinture figée      | #webgl #ogl #canvas #transform-scale #requestAnimationFrame         |
| [LRN-011](learnings/LRN-011.md) | 2026-09-12 | Lib de drag react-draggable ne compense qu'un `scale`, jamais une `rotation`          | #css #rotation #drag-drop #pointer-events #react-rnd #transform     |
| [LRN-012](learnings/LRN-012.md) | 2026-09-12 | `height:100%` sur `position:fixed` ignore la barre d'adresse mobile                   | #css #dvh #viewport #mobile #fixed-position #android-chrome         |
| [LRN-013](learnings/LRN-013.md) | 2026-09-12 | `Radix Tabs.Trigger` ignore un `.click()` JS simple                                   | #radix #tabs #testing #pointer-events #automation #dispatchevent    |
| [LRN-014](learnings/LRN-014.md) | 2026-09-12 | Grille CSS plutôt que 2 lignes flex indépendantes pour aligner des colonnes           | #css #grid #flexbox #alignment #layout                              |
| [LRN-015](learnings/LRN-015.md) | 2026-09-12 | État de drag/preview transitoire : garder local + `createPortal`, pas lever au parent | #react #re-render #performance #createportal #state-scope           |
| [LRN-016](learnings/LRN-016.md) | 2026-09-12 | Tester le CORS (`curl -H Origin`) avant de choisir fetch client vs proxy serveur      | #cors #api #curl #architecture #proxy                               |
| [LRN-017](learnings/LRN-017.md) | 2026-09-12 | Erreur console du Browser pane : peut être un résidu HMR, revérifier sur onglet neuf  | #vite #hmr #browser-pane #debugging #false-positive                 |
| [LRN-018](learnings/LRN-018.md) | 2026-09-12 | Composant dupliqué 3x, layouts différents → extraire via variant `cva`, pas copier    | #react #duplication #cva #variant #component-extraction #widget     |
| [LRN-019](learnings/LRN-019.md) | 2026-09-12 | `dumpsys gfxinfo` pour objectiver un ressenti de saccade Android                      | #android #dumpsys #gfxinfo #performance #debugging                  |
| [LRN-020](learnings/LRN-020.md) | 2026-09-12 | Service Android démarré par le système peut échouer via un app-op OEM                 | #android #appops #oem-restriction #dreamservice #adb                |
| [LRN-021](learnings/LRN-021.md) | 2026-09-12 | Appli tierce fluide en vidéo ⇏ `<video>` HTML profite du même chemin matériel         | #android #webview #video #hardware-acceleration #hypothesis-testing |
