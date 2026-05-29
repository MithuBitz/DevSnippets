import Ionicons from "@expo/vector-icons/Ionicons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

const TAB_ICON_SIZE = 22;

const palette = {
  light: {
    bar: "#FFFFFF",
    barBorder: "rgba(15, 23, 42, 0.08)",
    active: "#4F46E5",
    inactive: "#94A3B8",
    activeBg: "rgba(79, 70, 229, 0.12)",
    label: "#0F172A",
    shadow: "#0F172A",
  },
  dark: {
    bar: "#1E293B",
    barBorder: "rgba(148, 163, 184, 0.12)",
    active: "#818CF8",
    inactive: "#64748B",
    activeBg: "rgba(129, 140, 248, 0.18)",
    label: "#F8FAFC",
    shadow: "#000000",
  },
} as const;

function MyTabBar({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = palette[scheme];
  const useGlass = isLiquidGlassAvailable();

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}
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

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
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
              name={
                focused ? "file-tray" : "file-tray-outline"
              }
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