import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";

import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { PlanList } from "@/components/PlanList";
import { SafeAreaView } from "react-native-safe-area-context";
import SwipeableTabs from "@/components/SwipeTabs/SwipeableTabs";
import { useCategoryTags } from "@/hooks/useCategoryTags";

export default function PlannerPage() {
  const { tags, selectedIndex, setSelectedIndex } = useCategoryTags();

  return (
    <SafeAreaView>
      <SwipeableTabs
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
