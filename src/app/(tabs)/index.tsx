import { Snippet } from "@/types";
import { getDB } from "@/utils/database";
import { useTheme } from "@/contexts/theme-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const themes = {
  light: {
    background: "#fff",
    card: "#f5f5f5",
    text: "#1a1a1a",
    subtext: "#666666",
    accent: "#6c63ff",
  },
  dark: {
    background: "#121212",
    card: "#1e1e1e",
    text: "#ffffff",
    subtext: "#AAAAAA",
    accent: "#9d97ff",
  },
};

const HomeScreen = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const { isDark, setManualDark } = useTheme();
  const theme = isDark ? themes.dark : themes.light;

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={[styles.header, { borderBottomColor: theme.subtext + "33" }]}>
        <Text style={styles.appName}>
          <Text style={{ color: theme.accent }}>Dev</Text>
          <Text style={{ color: theme.text }}>Snippets</Text>
        </Text>
        <View
          style={[
            styles.themeToggle,
            { backgroundColor: theme.card },
          ]}
        >
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={18}
            color={theme.accent}
          />
          <Text style={[styles.themeLabel, { color: theme.subtext }]}>
            {isDark ? "Dark" : "Light"}
          </Text>
          <Switch
            value={isDark}
            onValueChange={setManualDark}
            trackColor={{ false: "#c4c4c4", true: theme.accent + "88" }}
            thumbColor={isDark ? theme.accent : "#fff"}
            ios_backgroundColor="#c4c4c4"
          />
        </View>
      </View>
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: theme.accent }]}
        onPress={() => router.push("/create")}
      >
        <Text style={styles.addBtnText}>+ New Snippet</Text>
      </TouchableOpacity>
      <FlatList
        data={snippets}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.subtext }]}>
            No snippets yet
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: theme.card, borderLeftColor: theme.accent },
            ]}
            onPress={() => router.push(`/snippet/${item.id}`)}
          >
            <Text style={[styles.title, { color: theme.accent }]}>
              {item.title}
            </Text>
            <Text style={[styles.lang, { color: theme.subtext }]}>
              {item.language}
            </Text>
            <Text
              style={[styles.code, { color: theme.text }]}
              numberOfLines={2}
            >
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
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  themeLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  addBtn: {
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  addBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  lang: { fontSize: 12, marginTop: 4 },
  code: {
    fontFamily: "monospace",
    fontSize: 12,
    marginTop: 8,
  },
  empty: { textAlign: "center", marginTop: 40 },
});
