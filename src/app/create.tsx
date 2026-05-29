import { getDefaultLanguage } from "@/services/storage";
import { getDB } from "@/utils/database";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const CreateSnippetScreen = () => {
  //Intitialize states
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [tags, setTags] = useState("");

  //Set the language at first load
  useEffect(() => {
    (async () => {
      const defLang = await getDefaultLanguage();
      if (defLang) {
        setLanguage(defLang);
      }
    })();
  }, []);

  const handleSave = async () => {
    //validate title and code are not empty
    if (!title || !code) return alert("Title and code are required");

    //get the db instance
    const db = await getDB();

    //Create unique id for the snippet using crypto.randomUUID()
    const id =
      Date.now().toString(36) + Math.random().toString(36).substring(2);

    //Run query to insert the snippet into the database with help of runAsync method
    await db.runAsync(
      `INSERT INTO snippets (id, title, language, code, tags, folderId, isFavorite, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, language, code, tags, null, false, new Date().toISOString()],
    );

    //After creating the snippet, navigate back to the previous screen
    router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#8B949E"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Language"
        placeholderTextColor="#8B949E"
        value={language}
        onChangeText={setLanguage}
      />
      <TextInput
        style={[styles.input, styles.codeInput]}
        placeholder="Paste code here..."
        placeholderTextColor="#8B949E"
        value={code}
        onChangeText={setCode}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Tags (comma separated)"
        placeholderTextColor="#8B949E"
        value={tags}
        onChangeText={setTags}
      />
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Snippet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateSnippetScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D1117" },
  input: {
    backgroundColor: "#161B22",
    color: "#C9D1D9",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#30363D",
    marginBottom: 16,
  },
  codeInput: {
    minHeight: 150,
    textAlignVertical: "top",
    fontFamily: "monospace",
  },
  saveBtn: {
    backgroundColor: "#238636",
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  saveBtnText: { color: "#FFF", fontWeight: "bold" },
});
