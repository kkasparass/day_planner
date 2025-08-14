import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Image,
  Platform,
  View,
  ScrollView,
  Dimensions,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button, Card, Divider, FAB, List, Text } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { PlanningCategories, PlanningCategory } from "@/types/types";
import { NestedPlanAccordion } from "@/components/NestedPlanAccordion";
import { InputDialog } from "@/components/dialogs/InputDialog";
import { PlanList } from "@/components/PlanList";
import { SafeAreaView } from "react-native-safe-area-context";
import SwipeableTabs from "@/components/SwipeTabs/SwipeableTabs";

export default function TabTwoScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const db = useSQLiteContext();
  const [tags, setTags] = useState<(string | null)[]>([]);
  const [reloadDB, setReloadDB] = useState(true);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<{ tag: string | null }>(
        `SELECT tag FROM planning_categories GROUP BY tag;`
      );
      setTags(result.length < 1 ? [null] : result.map(({ tag }) => tag));
    }
    if (reloadDB) {
      setup();
      setReloadDB(false);
    }
  }, [reloadDB]);

  return (
    <SafeAreaView>
      <SwipeableTabs
        onSwipe={(x) => setSelectedIndex(x)}
        selectedIndex={selectedIndex}
        labels={tags.map((tag) => (tag === null ? "all" : tag))}
      >
        {tags.map((tag) => (
          <PlanList tag={tag} key={tag} />
        ))}
      </SwipeableTabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
