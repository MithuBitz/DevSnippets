import { ThemeProvider, useTheme } from "@/contexts/theme-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

const TAB_ICON_SIZE = 22;

const palette = {
  light: {
    background: "#fff",
    bar: "#f5f5f5",
    barBorder: "rgba(26, 26, 26, 0.08)",
    active: "#6c63ff",
    inactive: "#666666",
    activeBg: "rgba(108, 99, 255, 0.12)",
    label: "#1a1a1a",
    shadow: "#1a1a1a",
  },
  dark: {
    background: "#121212",
    bar: "#1e1e1e",
    barBorder: "rgba(170, 170, 170, 0.12)",
    active: "#9d97ff",
    inactive: "#AAAAAA",
    activeBg: "rgba(157, 151, 255, 0.18)",
    label: "#ffffff",
    shadow: "#000000",
  },
} as const;

function MyTabBar({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) {
  const { isDark } = useTheme();
  const scheme = isDark ? "dark" : "light";
  const colors = palette[scheme];
  const useGlass = isLiquidGlassAvailable();

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: Math.max(insets.bottom, 12),
          backgroundColor: colors.background,
        },
      ]}
    >
      {useGlass ? (
        <GlassView
          style={[styles.bar, styles.barGlass]}
          glassEffectStyle="regular"
          colorScheme={scheme}
        >
          <TabBarContent
            state={state}
            descriptors={descriptors}
            navigation={navigation}
            colors={colors}
          />
        </GlassView>
      ) : (
        <View
          style={[
            styles.bar,
            {
              backgroundColor: colors.bar,
              borderColor: colors.barBorder,
              ...Platform.select({
                ios: {
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: scheme === "dark" ? 0.35 : 0.12,
                  shadowRadius: 16,
                },
                android: { elevation: 12 },
                default: {},
              }),
            },
          ]}
        >
          <TabBarContent
            state={state}
            descriptors={descriptors}
            navigation={navigation}
            colors={colors}
          />
        </View>
      )}
    </View>
  );
}

type TabBarContentProps = Pick<
  BottomTabBarProps,
  "state" | "descriptors" | "navigation"
> & {
  colors: (typeof palette)[keyof typeof palette];
};

function TabBarContent({
  state,
  descriptors,
  navigation,
  colors,
}: TabBarContentProps) {
  return (
    <View style={styles.tabsRow}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : (options.title ?? route.name);
        const tint = isFocused ? colors.active : colors.inactive;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const icon = options.tabBarIcon?.({
          focused: isFocused,
          color: tint,
          size: TAB_ICON_SIZE,
        });

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            onPress={onPress}
            onLongPress={onLongPress}
            style={({ pressed }) => [
              styles.tab,
              isFocused && { backgroundColor: colors.activeBg },
              pressed && styles.tabPressed,
            ]}
          >
            <View style={styles.tabInner}>
              {icon}
              <Text
                style={[
                  styles.label,
                  {
                    color: isFocused ? colors.active : colors.inactive,
                    fontWeight: isFocused ? "600" : "500",
                  },
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function TabsNavigator() {
  const { isDark } = useTheme();
  const colors = palette[isDark ? "dark" : "light"];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: "Files",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "file-tray" : "file-tray-outline"}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <ThemeProvider>
      <TabsNavigator />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  bar: {
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  barGlass: {
    borderWidth: 0,
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    gap: 4,
  },
  tab: {
    flex: 1,
    borderRadius: 20,
    minHeight: 56,
    justifyContent: "center",
  },
  tabPressed: {
    opacity: 0.85,
  },
  tabInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 6,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
});
