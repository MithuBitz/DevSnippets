import { Snippet } from "@/types";
import { getDB } from "@/utils/database";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const SnippetDetailsScreen = () => {
  // Define State Variables
  const { id } = useLocalSearchParams<{ id: string }>();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // set Snippet on first load
  useEffect(() => {
    (async () => {
      //get the db instance
      const db = await getDB();

      // Get the snippet from the database using the id
      const result = await db.getFirstAsync<Snippet>(
        `SELECT * FROM snippets WHERE id = ?`,
        [id],
      );

      //IF the snippet is found, set the snippet state
      //Set the isFavorite state to the value of the snippet.isFavorite
      if (result) {
        setSnippet(result);
        setIsFav(result.isFavorite === true);
      }
    })();
  }, [id]);

  //Implement toggle favorite function
  const toggleFav = async () => {
    //If no snippet then return
    if (!snippet) return;
    // get the db instance
    const db = await getDB();
    //if isFab is true then set false else set true
    const newFav = isFav ? false : true;
    // Update the isFavorite field in the database based on snippet id
    await db.runAsync(`UPDATE snippets SET isFavorite = ? WHERE id = ?`, [
      newFav,
      snippet.id,
    ]);
    //toggle the isFav state
    setIsFav(!isFav);
  };

  //Ai implementation
  const handleAI = async () => {
    if (!snippet) return;
    setLoading(true);
    setExplanation("AI is not implemented yet");
    setLoading(false);
  };

  //Show the loading text is snippet is not loaded yet
  if (!snippet)
    return (
      <View style={styles.container}>
        <Text style={{ color: "FFF" }}>Loading...</Text>
      </View>
    );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{snippet.title}</Text>
        <TouchableOpacity onPress={toggleFav}>
          <Text style={{ fontSize: 24 }}>{isFav ? "⭐" : "☆"}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.lang}>{snippet.language}</Text>

      <View style={styles.codeBlock}>
        <Text style={styles.code}>{snippet.code}</Text>
      </View>

      <TouchableOpacity
        style={styles.aiBtn}
        onPress={handleAI}
        disabled={loading}
      >
        <Text style={styles.aiBtnText}>✨ Explain with AI</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator color="#58A6FF" style={{ marginVertical: 20 }} />
      )}
      {explanation && (
        <View style={styles.explainBox}>
          <Text style={styles.explainText}>{explanation}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default SnippetDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D1117" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: "#58A6FF", fontSize: 24, fontWeight: "bold", flex: 1 },
  lang: { color: "#8B949E", fontSize: 14, marginTop: 4, marginBottom: 16 },
  codeBlock: {
    backgroundColor: "#161B22",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#30363D",
  },
  code: { color: "#C9D1D9", fontFamily: "monospace", fontSize: 14 },
  aiBtn: {
    backgroundColor: "#8957E5",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 20,
  },
  aiBtnText: { color: "#FFF", fontWeight: "bold" },
  explainBox: {
    backgroundColor: "#161B22",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderColor: "#8957E5",
  },
  explainText: { color: "#C9D1D9", fontSize: 14, lineHeight: 22 },
});
