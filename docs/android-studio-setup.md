# Tuto — Compiler et installer Ambio sur la TV

Guide complet pour installer Android Studio, builder l'APK, et l'installer
sur la TV TCL via `adb`.

## 1. Installer Android Studio

1. Télécharger depuis [developer.android.com/studio](https://developer.android.com/studio)
2. Lancer l'installeur, garder les composants par défaut cochés :
   - Android SDK
   - Android SDK Platform-Tools (contient `adb`)
   - Android Virtual Device (pas indispensable ici, pas d'émulateur utilisé)
3. Au premier lancement, suivre le wizard "Setup Wizard" — il télécharge le
   SDK (compte ~2-3 Go, laisser faire).

## 2. Ouvrir le projet

1. **File → Open** → sélectionner le dossier `android-app/`
2. Attendre le **Gradle Sync** (barre de progression en bas de la fenêtre).
   La première fois, ça télécharge le wrapper Gradle 8.7, l'Android Gradle
   Plugin 8.6 et les dépendances Kotlin — peut prendre plusieurs minutes.
3. Si une popup propose de générer le wrapper Gradle manquant, accepter.

## 3. Vérifier les IPs avant de builder

Ouvrir `app/src/main/java/com/baptistelechat/ambio/MyDreamService.kt` et
vérifier que `CANDIDATE_HOSTS` correspond à ton réseau actuel :

```kotlin
private val CANDIDATE_HOSTS = listOf(
    "192.168.1.74:5173",  // PC de dev
    "192.168.1.210:5173", // RPi (prod)
)
```

- IP du PC : `ipconfig` (Windows), chercher `IPv4` sous l'adaptateur Wi-Fi.
- IP du RPi : `hostname -I` en SSH sur le RPi.

Si une IP a changé, la modifier ici puis rebuild (étape suivante).

## 4. Compiler l'APK

**Option A — Android Studio (interface graphique)**

Menu **Build → Build Bundle(s) / APK(s) → Build APK(s)**. Une fois terminé,
une notification "APK(s) generated successfully" apparaît avec un lien
"locate" vers le fichier généré.

**Option B — ligne de commande**

```bash
cd android-app
./gradlew assembleDebug        # macOS/Linux
gradlew.bat assembleDebug      # Windows
```

Dans les deux cas, l'APK est généré ici :

```
android-app/app/build/outputs/apk/debug/app-debug.apk
```

## 5. Connecter `adb` à la TV

La TV doit avoir le mode développeur + débogage activés.

### Activer le mode développeur sur la TV

1. **Paramètres → Système → À propos** (ou "Infos sur l'appareil")
2. Cliquer 7 fois sur "Version du build" / "Build" jusqu'au message
   "Vous êtes développeur"
3. Retour dans **Paramètres → Système** → une nouvelle entrée "Options pour
   les développeurs" apparaît
4. Dans ce menu, activer **"Débogage réseau"** (ou "Débogage sans fil" /
   "Wireless debugging" selon la version) — évite d'avoir besoin d'un câble

### Connexion via le réseau (recommandé)

1. Récupérer l'IP de la TV : **Paramètres → Réseau → État de la connexion**
2. Depuis le PC :
   ```bash
   adb connect <IP_DE_LA_TV>:5555
   adb devices
   ```
3. Un popup de confirmation ("Autoriser le débogage USB ?") apparaît sur
   l'écran TV — l'accepter avec la télécommande. `adb devices` doit ensuite
   afficher l'appareil avec le statut `device` (pas `unauthorized`).

### Connexion USB (alternative)

Câble USB TV ↔ PC (adaptateur selon le port de la TV), puis `adb devices`
doit lister l'appareil directement.

## 6. Installer l'APK

```bash
adb install -r android-app/app/build/outputs/apk/debug/app-debug.apk
```

`-r` réinstalle en écrasant une version précédente si déjà présente.

## 7. Activer l'écran de veille Ambio

1. Ouvrir l'app **"Ambio"** depuis la liste des apps de la TV → redirige
   automatiquement vers **Paramètres → Écran de veille**
2. Sélectionner **"Ambio"** dans la liste des écrans de veille disponibles
3. Régler le délai d'activation si besoin (ex : 5 min d'inactivité)

En secours, si le menu système ne s'ouvre pas (dépend du fabricant/version) :

```bash
adb shell settings put secure screensaver_components com.baptistelechat.ambio/.MyDreamService
adb shell settings put secure screensaver_enabled 1
```

Ce réglage survit aux redémarrages de la TV.

## 8. Tester

- Laisser la TV inactive le temps configuré, ou chercher une option "Lancer
  maintenant" dans les réglages de l'écran de veille.
- Couper le PC de dev et le RPi pour vérifier le fallback (image statique)
  et la reconnexion automatique après ~30s quand l'un des deux revient.

## Dépannage courant

| Problème                                                | Cause probable                                  | Solution                                                                                   |
| ------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `adb devices` ne liste rien                             | TV pas en mode debug, ou pas sur le même réseau | Vérifier "Débogage réseau" activé + IP TV correcte                                         |
| Statut `unauthorized`                                   | Popup de confirmation pas accepté sur la TV     | Accepter le popup avec la télécommande                                                     |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE`                    | Version précédente signée différemment          | `adb uninstall com.baptistelechat.ambio` puis réinstaller                                  |
| L'app n'apparaît pas dans la liste des écrans de veille | Manifest mal enregistré                         | `adb shell pm list packages \| grep ambio` pour confirmer l'install, puis redémarrer la TV |
| Écran figé/noir en veille                               | PC et RPi injoignables, fallback qui échoue     | Vérifier `CANDIDATE_HOSTS`, tester `adb shell ping <ip>` depuis la TV (via `adb shell`)    |
