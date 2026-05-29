import { Snippet } from "@/types";
import { getDB } from "@/utils/database";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FavScreen = ({ navigation }: any) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  const loadFavs = async () => {
    const db = await getDB();

    const results = await db.getAllAsync<Snippet>(`
      SELECT * FROM snippets WHERE isFavorite = 1 ORDER BY createdAt DESC
    `);
    setSnippets(results);
  };

  //Each time the screen is focused, load the favs
  //Each time the screen is focused, load the favs
  useFocusEffect(
    useCallback(() => {
      loadFavs();
    }, [loadFavs]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={snippets}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No favorites yet</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Home", {
                screen: "SnippetDetail",
                params: { snippet: item },
              })
            }
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.code} numberOfLines={1}>
              {item.code}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default FavScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D1117" },
  card: {
    backgroundColor: "#161B22",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderColor: "#E3B341",
  },
  title: { color: "#E3B341", fontSize: 18, fontWeight: "bold" },
  code: {
    color: "#C9D1D9",
    fontFamily: "monospace",
    fontSize: 12,
    marginTop: 8,
  },
  empty: { color: "#8B949E", textAlign: "center", marginTop: 40 },
});
