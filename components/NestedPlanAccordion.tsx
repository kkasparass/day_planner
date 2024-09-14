import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform, View, Pressable } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button, Divider, FAB, List, Text } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { PlanningCategories, PlanningCategory } from "@/types/types";
import { InputDialog } from "./InputDialog";
import { Link } from "expo-router";

export const NestedPlanAccordion = ({
  isBase,
  cat,
  reloadParent,
}: {
  cat: PlanningCategory;
  reloadParent: () => void;
  isBase?: boolean;
}) => {
  const [selected, setselected] = useState(false);
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<PlanningCategories>([]);
  const [reloadDB, setReloadDB] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<PlanningCategory>(
        `SELECT * FROM planning_categories WHERE parent = ${cat.id}`
      );
      setCategories(result);
    }
    if (reloadDB) {
      setup();
      setReloadDB(false);
    }
  }, [reloadDB]);

  const onNewCategory = async (label: string) => {
    const res = await db.runAsync(
      "INSERT INTO planning_categories (label, parent, parentLabel) VALUES (?, ?, ?)",
      label,
      cat.id,
      cat.label
    );
    setReloadDB(true);
  };

  const handleDelete = async () => {
    await db.runAsync("DELETE FROM planning_categories WHERE id = $id", {
      $id: cat.id,
    });
    reloadParent();
  };

  const toggle = () => {
    setselected((value) => !value);
  };

  const hasChidlren = categories.length > 0;

  return (
    <Pressable onPress={toggle}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: 5,
        }}
      >
        <Text
          style={
            cat.completed && {
              textDecorationLine: "line-through",
              textDecorationStyle: "solid",
            }
          }
        >
          {cat.label} {hasChidlren && <Text>{selected ? "-" : "+"}</Text>}
        </Text>
        <View
          style={{
            columnGap: 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: 35,
          }}
        >
          {isBase && (
            <Link
              href={{
                // @ts-ignore: funky typings
                pathname: "/planner/edit/[id]",
                params: { id: cat.id },
              }}
              asChild
            >
              <Button>E</Button>
            </Link>
          )}
          <Button onPress={handleDelete}>-</Button>
          <Button onPress={() => setDialogVisible(true)}>+</Button>
        </View>
      </View>
      {selected && (
        <View style={{ marginLeft: 20 }}>
          {hasChidlren &&
            categories.map((child) => (
              <NestedPlanAccordion
                cat={child}
                key={child.id}
                reloadParent={() => setReloadDB(true)}
              />
            ))}
        </View>
      )}
      <InputDialog
        isVisible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onTextSubmit={onNewCategory}
      />
    </Pressable>
  );
};
