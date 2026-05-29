import { Snippet } from "@/types";
import { getDB } from "@/utils/database";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  const loadSnippets = async () => {
    const db = await getDB();
    const results = await db.getAllAsync<Snippet>(
      "SELECT * FROM snippets ORDER BY createdAt DESC",
    );
    setSnippets(results);
    // console.log(results);
  };

  useEffect(() => {
    loadSnippets();
  }, [snippets]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/create")}
      >
        <Text style={styles.addBtnText}>+ New Snippet</Text>
      </TouchableOpacity>
      <FlatList
        data={snippets}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={styles.empty}>No snippets yet</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/snippet/${item.id}`)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.lang}>{item.language}</Text>
            <Text style={styles.code} numberOfLines={2}>
              {item.code}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D1117", padding: 16 },
  addBtn: {
    backgroundColor: "#238636",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  addBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  card: {
    backgroundColor: "#161B22",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderColor: "#58A6FF",
  },
  title: { color: "#58A6FF", fontSize: 18, fontWeight: "bold" },
  lang: { color: "#8B949E", fontSize: 12, marginTop: 4 },
  code: {
    color: "#C9D1D9",
    fontFamily: "monospace",
    fontSize: 12,
    marginTop: 8,
  },
  empty: { color: "#8B949E", textAlign: "center", marginTop: 40 },
});
