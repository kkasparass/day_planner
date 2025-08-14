import Ionicons from "@expo/vector-icons/Ionicons";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

import { Card, FAB } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { PlanningCategories, PlanningCategory } from "@/types/types";
import { InputDialog } from "@/components/dialogs/InputDialog";
import { NestedPlanAccordionCTA } from "./NestedPlanAccordionCTA";

export const TodaoPlanList = ({
  tag,
  onTextSubmit,
  energyCap,
  currentEffortTotal,
}: {
  tag: string | null;
  onTextSubmit: (label: string, cat?: PlanningCategory) => void;
  energyCap: number;
  currentEffortTotal: number;
}) => {
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<PlanningCategories>([]);
  const [reloadDB, setReloadDB] = useState(true);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<PlanningCategory>(
        `SELECT * FROM planning_categories WHERE parent IS NULL AND ${
          tag === null ? "tag is NULL" : `tag="${tag}" AND completed=0`
        }`
      );
      setCategories(result);
    }
    if (reloadDB) {
      setup();
      setReloadDB(false);
    }
  }, [reloadDB]);

  return (
    <View
      style={{
        height: "100%",
      }}
    >
      <ScrollView>
        <View style={{ gap: 15, marginBottom: 100 }}>
          {categories.map((cat) => (
            <Card key={cat.id} style={{ paddingHorizontal: 10 }}>
              <NestedPlanAccordionCTA
                onTextSubmit={onTextSubmit}
                cat={cat}
                energyCap={energyCap}
                currentEffortTotal={currentEffortTotal}
              />
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

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
