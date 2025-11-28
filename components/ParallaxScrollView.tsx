import type { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = PropsWithChildren<{ title?: string; fullWidth?: boolean }>;

export default function ParallaxScrollView({
  children,
  title,
  fullWidth,
}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {title && (
        <Appbar>
          <Appbar.Content title={title} />
        </Appbar>
      )}
      <ThemedView
        style={{
          ...styles.content,
          ...(fullWidth && { paddingHorizontal: 0 }),
        }}
      >
        {children}
      </ThemedView>
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
    padding: 16,
    gap: 16,
    overflow: "hidden",
  },
});
