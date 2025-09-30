import type { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = PropsWithChildren<{ title: string }>;

export default function ParallaxScrollView({ children, title }: Props) {
  return (
    <SafeAreaView style={styles.container}>
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
  content: {
    height: "100%",
    flex: 1,
    padding: 25,
    gap: 16,
    overflow: "hidden",
  },
});
