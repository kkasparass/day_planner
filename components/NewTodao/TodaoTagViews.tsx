import { ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { Button, Card, Dialog, Portal, TextInput } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { PlanningCategories, PlanningCategory } from "@/types/types";
import SwipeableTabs from "../SwipeTabs/SwipeableTabs";
import { PlanList } from "../PlanList";
import { TodaoPlanList } from "./TodaoPlanList";

export const TodaoTagViews = ({
  onTextSubmit,
  energyCap,
  currentEffortTotal,
}: {
  onTextSubmit: (label: string, cat?: PlanningCategory) => void;
  energyCap: number;
  currentEffortTotal: number;
}) => {
  const db = useSQLiteContext();
  const [tags, setTags] = useState<(string | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<{ tag: string | null }>(
        `SELECT tag FROM planning_categories GROUP BY tag;`
      );
      setTags(result.map(({ tag }) => tag));
    }
    setup();
  }, []);

  return (
    <View style={{ height: 550 }}>
      <SwipeableTabs
        onSwipe={(x) => setSelectedIndex(x)}
        selectedIndex={selectedIndex}
        labels={tags.map((tag) => (tag === null ? "all" : tag))}
      >
        {tags.map((tag) => (
          <TodaoPlanList
            onTextSubmit={onTextSubmit}
            tag={tag}
            key={tag}
            energyCap={energyCap}
            currentEffortTotal={currentEffortTotal}
          />
        ))}
      </SwipeableTabs>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
