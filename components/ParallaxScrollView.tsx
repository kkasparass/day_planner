import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import Animated from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Appbar, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = PropsWithChildren<{ title: string }>;

export default function ParallaxScrollView({ children, title }: Props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar>
        <Appbar.Content title={title} />
      </Appbar>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    overflow: "hidden",
  },
  headerText: {
    color: Colors.dark.text,
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    zIndex: 2,
  },
  content: {
    height: "100%",
    flex: 1,
    padding: 25,
    gap: 16,
    overflow: "hidden",
  },
});
