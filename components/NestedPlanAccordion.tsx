import { useState } from "react";
import { View, Pressable } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { PlanningCategory } from "@/types/types";
import { Link } from "expo-router";
import { LabelEffortDialog } from "./dialogs/LabelEffortDialog";
import { useChildCategories } from "@/hooks/useChildCategories";

export const NestedPlanAccordion = ({
  isBase,
  cat,
  reloadParent,
}: {
  cat: PlanningCategory;
  reloadParent: () => void;
  isBase?: boolean;
}) => {
  const { toggle, hasChidlren, selected, categories, triggerReloadDB } =
    useChildCategories({
      parent: cat,
    });
  const db = useSQLiteContext();
  const [dialogVisible, setDialogVisible] = useState(false);

  const onNewCategory = async (label: string, effort: number) => {
    const res = await db.runAsync(
      "INSERT INTO planning_categories (label, parent, parentLabel, repeatFreq, effort) VALUES (?, ?, ?, ?, ?)",
      label,
      cat.id,
      cat.label,
      0,
      effort
    );
    triggerReloadDB();
  };

  const handleDelete = async () => {
    await db.runAsync("DELETE FROM planning_categories WHERE id = $id", {
      $id: cat.id,
    });
    reloadParent();
  };

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
          style={{
            width: 150,
            ...(cat.completed && {
              textDecorationLine: "line-through",
              textDecorationStyle: "solid",
            }),
          }}
        >
          {hasChidlren && <Text>{selected ? "- " : "+ "}</Text>}
          {`${cat.label} | ${cat.effort}`}
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
                reloadParent={triggerReloadDB}
              />
            ))}
        </View>
      )}
      <LabelEffortDialog
        isVisible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onSubmit={onNewCategory}
        effort={0}
        defaultValue=""
        title="New Cat"
        triggerLabel="add"
        inputLabel="Cat Name"
      />
    </Pressable>
  );
};
