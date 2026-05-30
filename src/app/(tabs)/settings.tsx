import { getDefaultLanguage, saveDefaultLanguage } from "@/services/storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingScreen = () => {
  const [defLang, setDefLang] = useState("JavaScript");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const lang = await getDefaultLanguage();

      if (lang) setDefLang(lang);
    })();
  }, []);

  const handleSave = async () => {
    await saveDefaultLanguage(defLang);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Preferences (AsyncStorage)</Text>
      <TextInput
        style={styles.input}
        placeholder="Default Language"
        placeholderTextColor="#8B949E"
        value={defLang}
        onChangeText={setDefLang}
      />

      <Text style={[styles.header, { marginTop: 24 }]}>
        AI Configuration (SecureStore)
      </Text>
      <TextInput
        editable={false}
        style={styles.input}
        placeholder="Feature not available yet"
        placeholderTextColor="#8B949E"
        value={""}
        onChangeText={() => {}}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnText}>Save Settings</Text>
      </TouchableOpacity>

      {saved && <Text style={styles.saved}>✅ Settings saved securely!</Text>}
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D1117", padding: 16 },
  header: {
    color: "#C9D1D9",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#161B22",
    color: "#C9D1D9",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#30363D",
    marginBottom: 16,
  },
  btn: {
    backgroundColor: "#238636",
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: { color: "#FFF", fontWeight: "bold" },
  saved: { color: "#3FB950", textAlign: "center", marginTop: 16 },
});
