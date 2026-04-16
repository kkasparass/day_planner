import "react-native-gesture-handler";
import { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SQLiteProvider } from "expo-sqlite";
import { PaperProvider } from "react-native-paper";
import { migrateDbIfNeeded } from "@/migrations/migrateDbIfNeeded";
import { store } from "@/store/store";
import { Colors } from "@/constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded}>
          <PaperProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: Colors[colorScheme ?? "light"].background,
                  },
                  headerTintColor: Colors[colorScheme ?? "light"].text,
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="planner/edit/[id]" options={{ title: "Edit Plan" }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </ThemeProvider>
          </PaperProvider>
        </SQLiteProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
