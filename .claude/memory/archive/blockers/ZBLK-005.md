---
id: ZBLK-005
type: blocker
date: 2026-09-05
tags: [android, gradle, toolchain, autonomie]
---

# ZBLK-005 — Aucun toolchain Android disponible en CLI sur le PC

| Friction                                                                                                                                                                                                                         | Cause réelle                                                                                                                                                                        | Solution                                                                                                                                                                                                                                                                                                                                                                             | Statut |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| Impossible de compiler l'APK en ligne de commande : ni Android Studio, ni SDK, ni Gradle installés/trouvables au départ (seul `adb` en standalone). Le projet n'avait pas non plus de wrapper Gradle committé (`gradlew` absent) | Le projet Android venait d'être scaffoldé sans jamais avoir été ouvert dans un IDE ; `JAVA_HOME` système pointait en plus vers un vieux JDK ([LRN-005](../../learnings/LRN-005.md)) | Après qu'Android Studio ait été installé et synchronisé une première fois par l'utilisateur, réutiliser la distribution Gradle qu'il avait mise en cache (`~/.gradle/wrapper/dists/`) pour générer le wrapper (`gradle wrapper --gradle-version 8.7`), committer `gradlew`/`gradlew.bat`/`gradle-wrapper.jar`, et écrire `build-and-install.sh` qui force `JAVA_HOME` sur le bon JDK | résolu |

## Références

- [BDR-006](../../decisions/BDR-006.md) — décision de committer le wrapper et scripter le build
- [LRN-005](../../learnings/LRN-005.md) — piège JAVA_HOME rencontré en résolvant ce blocage
