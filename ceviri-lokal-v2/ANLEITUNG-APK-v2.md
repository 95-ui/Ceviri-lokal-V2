# 📱 CeviriLokal — APK bauen (korrigierte Anleitung v2)
## Warum v2? — Der "index.android.bundle"-Fehler erklärt

Der Fehler den du gesehen hast:
> **"Unable to load script. Make sure you're either running Metro or that your
> bundle 'index.android.bundle' is packaged correctly for release."**

**Ursache:** Beim `gradlew assembleDebug` wurde der JavaScript-Code nicht
automatisch in die APK eingebettet. Das passiert wenn man den Bundle-Schritt
vergisst. In v2 ist das behoben — wir machen den Bundle-Schritt explizit.

**Was in v2 neu ist:**
- Der komplette Übersetzer-Code steckt jetzt direkt im TypeScript (kein
  separater HTML-Asset-Loader mehr — war die andere Fehlerquelle)
- Der Bundle-Schritt ist jetzt klar in die Anleitung eingebaut
- Robustere Reihenfolge der Befehle

---

## Voraussetzungen
- ✅ GitHub-Account vorhanden
- ✅ ZIP-Datei `ceviri-lokal-v2.zip` heruntergeladen und entpackt
- ✅ Kein Android Studio nötig

**Geschätzte Gesamtdauer:** ~25 Minuten (davon ~15 min Wartezeit)

---

## SCHRITT 1 — Dateien zu GitHub hochladen

### 1a) Neues Repository (oder bestehendes nutzen)

Option A — **Neues Repo:**
1. https://github.com → **„+"** → **„New repository"**
2. Name: `ceviri-lokal` → **„Add a README file"** ✅ → **„Create repository"**

Option B — **Bestehendes Repo leeren und neu befüllen:**
1. In deinem alten Repo: alle alten Dateien löschen (einzeln: Datei anklicken → 🗑 Delete)
2. Dann neue Dateien hochladen (nächster Schritt)

### 1b) Dateien hochladen

Du hast nach dem Entpacken diesen Ordner:
```
ceviri-lokal-v2/
├── index.js
├── package.json
├── app.json
├── babel.config.js
├── metro.config.js
├── tsconfig.json
├── make_icons.py
└── src/
    ├── App.tsx
    └── translator-html.ts   ← NEU (kein translator.html mehr)
```

1. Auf deinem Repo: **„Add file"** → **„Upload files"**
2. Den **gesamten Inhalt** des `ceviri-lokal-v2/`-Ordners reinziehen
   (alle Dateien + den `src/`-Ordner)
3. Commit-Nachricht: `v2 - bundle fix`
4. **„Commit changes"**

---

## SCHRITT 2 — Codespace starten

1. Auf deinem Repo: grüner **„Code"-Button** → **„Codespaces"**
2. **„Create codespace on main"** (oder falls schon einer existiert: ihn öffnen)
3. Warte 1–2 Minuten bis VS Code im Browser erscheint

> **Achtung falls du einen alten Codespace hast:** Öffne ihn und führe aus:
> `cd /workspaces && rm -rf ceviri-lokal && git clone ... `
> — oder erstelle einfach einen neuen Codespace.

---

## SCHRITT 3 — Umgebung einrichten (einmalig)

Im **Terminal** (unten im Codespace) — nach jedem Befehl Enter drücken und
warten bis `$` wieder erscheint.

### 3a) Java-Version prüfen
```bash
java -version
```
Muss `17.x.x` zeigen. Falls nicht:
```bash
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
```

### 3b) Node-Pakete installieren
```bash
npm install
```
*(Dauert 2–3 Min.)*

### 3c) Icons erstellen
```bash
python3 make_icons.py
```
Ausgabe: `✓ assets/icon.png` usw. — wenn das erscheint: gut ✅

### 3d) Android SDK einrichten
Kopiere diesen gesamten Block und füge ihn ins Terminal ein (alles auf einmal):

```bash
export ANDROID_HOME=$HOME/android-sdk
mkdir -p $ANDROID_HOME/cmdline-tools
cd $HOME
wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip -q commandlinetools-linux-11076708_latest.zip -d $ANDROID_HOME/cmdline-tools
mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
yes | sdkmanager --licenses > /dev/null 2>&1
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
echo "export ANDROID_HOME=\$HOME/android-sdk" >> ~/.bashrc
echo "export PATH=\$PATH:\$ANDROID_HOME/cmdline-tools/latest/bin:\$ANDROID_HOME/platform-tools" >> ~/.bashrc
source ~/.bashrc
echo "Android SDK bereit ✓"
```
*(Dauert 3–5 Min. — „Android SDK bereit ✓" am Ende = gut)*

---

## SCHRITT 4 — Android-Projektstruktur erzeugen

```bash
cd /workspaces/ceviri-lokal
npx expo prebuild --platform android --clean
```

Wenn gefragt **„What would you like your Android package name to be?"**:
→ `de.ceviri.lokal` eingeben → Enter

*(Dauert ~1–2 Min. — erzeugt den `android/`-Ordner)*

---

## SCHRITT 5 — JavaScript-Bundle einbetten ← DAS WAR VORHER FEHLEND

Das ist der Schritt, der beim ersten Versuch gefehlt hat und den Fehler verursacht hat.
Er bettet den gesamten App-Code als Datei in das Android-Projekt ein:

```bash
mkdir -p android/app/src/main/assets

npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res
```

*(Dauert ~1 Min. — am Ende: keine Fehlermeldung = gut ✅)*

Du kannst prüfen ob es funktioniert hat:
```bash
ls -lh android/app/src/main/assets/index.android.bundle
```
Wenn eine Datei mit ~1–5 MB erscheint: perfekt ✅

---

## SCHRITT 6 — APK bauen

```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
```

**Beim ersten Mal dauert das 8–15 Minuten.**
Du siehst viele Zeilen — das ist normal. Warten bis:
```
BUILD SUCCESSFUL in Xm Xs
```
erscheint.

Falls Fehler wegen `JAVA_HOME`:
```bash
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
./gradlew assembleDebug
```

---

## SCHRITT 7 — APK herunterladen

Die fertige APK liegt hier:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**Herunterladen:**
1. Links im Codespace: Datei-Explorer (erstes Icon in der Seitenleiste)
2. Navigiere: `android` → `app` → `build` → `outputs` → `apk` → `debug`
3. **Rechtsklick** auf `app-debug.apk` → **„Download"**

---

## SCHRITT 8 — Auf Handy/Tablet installieren

### 8a) Unbekannte Quellen erlauben (einmalig)
- **Android 8+:** Einstellungen → Apps → [Browser/Dateimanager] → „Apps aus dieser Quelle installieren" → Ein
- **Älter:** Einstellungen → Sicherheit → „Unbekannte Quellen" → Ein

### 8b) APK übertragen
- **Per USB:** Handy anschließen → „Dateiübertragung" → APK in Downloads kopieren
- **Per E-Mail:** APK an dich selbst schicken, auf Handy öffnen

### 8c) Installieren
Dateimanager → Downloads → `app-debug.apk` antippen → „Installieren" → ✅

---

## SCHRITT 9 — Erste Nutzung

1. App öffnen → Ladebalken erscheint (das ist normal)
2. **„Modelle"-Tab** antippen
3. **OPUS-MT → „⬇ Laden"** antippen (braucht WLAN, ~80 MB, einmalig)
4. Warten bis „✓ Geladen" erscheint
5. **„Als aktives Modell nutzen"** antippen
6. **„Übersetzen"-Tab** → Text eingeben → **„Übersetzen"**

Nach dem Download: **offline nutzbar** ✅

---

## ❓ Häufige Probleme

| Problem | Lösung |
|---|---|
| Alter "bundle"-Fehler taucht wieder auf | Schritt 5 (Bundle-Befehl) nochmal ausführen, dann Schritt 6 |
| `gradlew: Permission denied` | `chmod +x android/gradlew` dann nochmal |
| `sdkmanager not found` | `source ~/.bashrc` ausführen, dann nochmal |
| BUILD FAILED (Speicher) | `./gradlew assembleDebug --max-workers 2` |
| App startet, KI lädt nicht | Beim ersten Start WLAN aktivieren (nur 1x nötig) |
| `expo prebuild` fragt nach package name | `de.ceviri.lokal` eingeben |

---

## 🔄 App aktualisieren (wenn du Änderungen machst)

```bash
cd /workspaces/ceviri-lokal

# Bundle neu erzeugen
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res

# APK neu bauen
cd android
./gradlew assembleDebug
```

---

## 📋 Alle Befehle auf einen Blick

```bash
# === EINMALIG (Umgebung) ===
java -version
npm install
python3 make_icons.py

# Android SDK (Block komplett einfügen):
export ANDROID_HOME=$HOME/android-sdk
mkdir -p $ANDROID_HOME/cmdline-tools && cd $HOME
wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip -q commandlinetools-linux-11076708_latest.zip -d $ANDROID_HOME/cmdline-tools
mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
yes | sdkmanager --licenses > /dev/null 2>&1
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
echo 'export ANDROID_HOME=$HOME/android-sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc

# === ANDROID-PROJEKT ===
cd /workspaces/ceviri-lokal
npx expo prebuild --platform android --clean
# (Paketname: de.ceviri.lokal)

# === BUNDLE-SCHRITT (wichtig!) ===
mkdir -p android/app/src/main/assets
npx react-native bundle \
  --platform android --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res

# === APK BAUEN ===
cd android && chmod +x gradlew && ./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

---

*CeviriLokal v2 · Offline-Übersetzer Deutsch ↔ Türkisch*
