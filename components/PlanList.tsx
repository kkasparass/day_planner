import Ionicons from "@expo/vector-icons/Ionicons";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

import { Button, Card, FAB } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { PlanningCategories, PlanningCategory } from "@/types/types";
import { NestedPlanAccordion } from "@/components/NestedPlanAccordion";
import { LabelEffortDialog } from "./dialogs/LabelEffortDialog";

export const PlanList = ({ tag }: { tag: string | null }) => {
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<PlanningCategories>([]);
  const [reloadDB, setReloadDB] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<PlanningCategory>(
        `SELECT * FROM planning_categories WHERE parent IS NULL AND ${
          tag === null ? "tag is NULL" : `tag="${tag}"`
        }`
      );
      setCategories(result);
    }
    if (reloadDB) {
      setup();
      setReloadDB(false);
    }
  }, [reloadDB]);

  const onNewParentCategory = async (label: string, effort: number) => {
    const res = await db.runAsync(
      "INSERT INTO planning_categories (label, tag, repeatFreq, effort) VALUES (?, ?, ?, ?)",
      label,
      tag,
      0,
      effort
    );
    setReloadDB(true);
  };

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
              <NestedPlanAccordion
                cat={cat}
                reloadParent={() => setReloadDB(true)}
                isBase
              />
            </Card>
          ))}
        </View>
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setDialogVisible(true)}
      />
      <LabelEffortDialog
        isVisible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onSubmit={onNewParentCategory}
        effort={0}
        label=""
        title="New Cat"
        triggerLabel="add"
        inputLabel="Cat Name"
      />
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
