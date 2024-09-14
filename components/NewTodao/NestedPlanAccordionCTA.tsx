import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform, View, Pressable } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button, Divider, FAB, List, Text } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { PlanningCategories, PlanningCategory } from "@/types/types";
import { AddFromPlanButton } from "./AddFromPlanButton";

export const NestedPlanAccordionCTA = ({
  cat,
  onTextSubmit,
}: {
  cat: PlanningCategory;
  onTextSubmit: (label: string, catId?: number) => void;
}) => {
  const [selected, setselected] = useState(true);
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<PlanningCategories>([]);
  const [reloadDB, setReloadDB] = useState(true);

  console.log(categories);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<PlanningCategory>(
        `SELECT * FROM planning_categories WHERE parent = ${cat.id} AND completed=0`
      );
      setCategories(result);
    }
    if (reloadDB) {
      setup();
      setReloadDB(false);
    }
  }, [reloadDB]);

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
        {hasChidlren ? (
          <Text
            style={
              cat.completed && {
                textDecorationLine: "line-through",
                textDecorationStyle: "solid",
              }
            }
          >
            {cat.label} {selected ? "-" : "+"}
          </Text>
        ) : (
          <AddFromPlanButton
            onPress={() => onTextSubmit(cat.label, cat.id)}
            label={cat.label}
            lastDone={cat.lastDone ? new Date(cat.lastDone).toDateString() : ""}
          />
        )}
      </View>
      {selected && (
        <View style={{ marginLeft: 20 }}>
          {hasChidlren &&
            categories.map((child) => (
              <NestedPlanAccordionCTA
                onTextSubmit={onTextSubmit}
                cat={child}
                key={child.id}
              />
            ))}
        </View>
      )}
    </Pressable>
  );
};
