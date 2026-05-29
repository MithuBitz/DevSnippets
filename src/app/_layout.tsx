import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0D1117" },
        headerTintColor: "#C9D1D9",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="create"
        options={{ title: "New Snippet", presentation: "modal" }}
      />
      <Stack.Screen
        name="snippet/[id]"
        options={{ title: "Snippet Details" }}
      />
    </Stack>
  );
}
