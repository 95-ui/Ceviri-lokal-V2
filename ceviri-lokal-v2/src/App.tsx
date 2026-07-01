import React, { useRef } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  Alert,
  Share,
  Platform,
  Text,
} from "react-native";
import { WebView } from "react-native-webview";
import * as ImagePicker from "expo-image-picker";
import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import { getTranslatorHTML } from "./translator-html";

// Normale Chrome-Kennung OHNE den "wv" (WebView) Marker.
// Grund: Manche Server mit Bot-Schutz (z.B. Hugging Face / Cloudflare)
// blockieren Anfragen, die als "WebView" erkennbar sind, mit 401/403 —
// was in transformers.js als "Unauthorized access to file" auftaucht.
// Eine normale Browser-Kennung umgeht das zuverlässig.
const CHROME_USER_AGENT =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";

export default function App() {
  const webviewRef = useRef<any>(null);

  // Send image as base64 into WebView for OCR
  const sendImage = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const ext = uri.split(".").pop()?.toLowerCase() || "jpeg";
      const mime = ext === "png" ? "image/png" : "image/jpeg";
      const js = `window.receiveImageBase64("data:${mime};base64,${base64}", "${mime}"); true;`;
      webviewRef.current?.injectJavaScript(js);
    } catch (e) {
      Alert.alert("Fehler", "Bild konnte nicht geladen werden.");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Berechtigung benötigt", "Bitte erlaube den Zugriff auf Fotos in den Einstellungen.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.92,
    });
    if (!result.canceled && result.assets?.[0]) {
      await sendImage(result.assets[0].uri);
    }
  };

  const useCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Berechtigung benötigt", "Bitte erlaube den Kamera-Zugriff in den Einstellungen.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.92,
    });
    if (!result.canceled && result.assets?.[0]) {
      await sendImage(result.assets[0].uri);
    }
  };

  const onMessage = async (event: any) => {
    let msg: any;
    try { msg = JSON.parse(event.nativeEvent.data); } catch { return; }

    switch (msg.type) {
      case "pickImage":   await pickImage();  break;
      case "useCamera":   await useCamera();  break;
      case "copy":
        if (msg.text) await Clipboard.setStringAsync(msg.text);
        break;
      case "speak":
        if (msg.text) {
          Speech.stop();
          Speech.speak(msg.text, { language: msg.lang || "tr-TR", rate: 0.9 });
        }
        break;
      case "share":
        if (msg.text) await Share.share({ message: msg.text });
        break;
    }
  };

  const html = getTranslatorHTML();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor="#05080f" />
      <WebView
        ref={webviewRef}
        source={{ html, baseUrl: "https://localhost/" }}
        style={styles.webview}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={true}
        originWhitelist={["*"]}
        mixedContentMode="always"
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        allowFileAccess={true}
        setSupportMultipleWindows={false}
        backgroundColor="#05080f"
        decelerationRate="normal"
        userAgent={CHROME_USER_AGENT}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05080f" },
  webview:   { flex: 1, backgroundColor: "#05080f" },
});
