import { getDefaultLanguage } from "@/services/storage";
import { getDB } from "@/utils/database";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

//Dropdown list for languages
const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "SQL",
  "Bash",
  "C++",
  "Java",
  "HTML/CSS",
];

const CreateSnippetScreen = () => {
  //Intitialize states
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [tags, setTags] = useState("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  //Set the language at first load
  useEffect(() => {
    (async () => {
      const defLang = await getDefaultLanguage();
      if (defLang && LANGUAGES.includes(defLang)) {
        setLanguage(defLang);
      }
    })();
  }, []);

  const handleSelectedLanguage = (lang: string) => {
    setLanguage(lang);
    setIsDropdownOpen(false);
  };

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
      [id, title, language, code, tags, null, 0, new Date().toISOString()],
    );

    //After creating the snippet, navigate back to the previous screen
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="#8B949E"
          value={title}
          onChangeText={setTitle}
        />

        {/* Custom Dropdown Trigger */}
        <TouchableOpacity
          style={styles.dropdownTrigger}
          onPress={() => setIsDropdownOpen(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.dropdownText}>{language}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

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

      {/* Custom Dropdown Modal */}
      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageOption}
                  onPress={() => handleSelectedLanguage(item)}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      item === language && styles.activeLanguageText,
                    ]}
                  >
                    {item}
                  </Text>
                  {item === language && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CreateSnippetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
  },
  input: {
    backgroundColor: "#161B22",
    color: "#C9D1D9",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#30363D",
    marginBottom: 16,
    fontSize: 16,
  },
  codeInput: {
    minHeight: 150,
    textAlignVertical: "top",
    fontFamily: "monospace",
    fontSize: 14,
  },

  // Dropdown Styles
  dropdownTrigger: {
    backgroundColor: "#161B22",
    borderWidth: 1,
    borderColor: "#30363D",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    color: "#C9D1D9",
    fontSize: 16,
  },
  dropdownArrow: {
    color: "#8B949E",
    fontSize: 12,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#161B22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#30363D",
    width: "100%",
    maxHeight: "70%",
    padding: 16,
  },
  modalTitle: {
    color: "#58A6FF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#21262D",
  },
  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  languageOptionText: {
    color: "#C9D1D9",
    fontSize: 16,
  },
  activeLanguageText: {
    color: "#58A6FF",
    fontWeight: "bold",
  },
  checkmark: {
    color: "#58A6FF",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Button Styles
  saveBtn: {
    backgroundColor: "#238636",
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
