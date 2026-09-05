#!/usr/bin/env bash
# Compile l'APK debug et l'installe sur un appareil adb connecté.
# Usage: ./build-and-install.sh [device-serial]
#   device-serial : optionnel, ex. 192.168.1.108:5555 (voir `adb devices`)
set -euo pipefail
cd "$(dirname "$0")"

# Le JAVA_HOME système peut pointer vers un vieux JDK 8 (incompatible avec AGP 8.6) — on force le 17.
export JAVA_HOME="/c/Program Files/Java/jdk-17"

./gradlew assembleDebug

APK="app/build/outputs/apk/debug/app-debug.apk"
DEVICE="${1:-}"

if [ -n "$DEVICE" ]; then
  adb -s "$DEVICE" install -r "$APK"
else
  adb install -r "$APK"
fi
