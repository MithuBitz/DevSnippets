import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";

type ThemeContextValue = {
  isDark: boolean;
  setManualDark: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [manualDark, setManualDark] = useState<boolean | null>(null);

  const value = useMemo(
    () => ({
      isDark:
        manualDark !== null ? manualDark : systemColorScheme === "dark",
      setManualDark,
    }),
    [manualDark, systemColorScheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
