import { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Button, Text } from "react-native-paper";
import { PlanningCategory } from "@/types/types";
import { useChildCategories } from "@/hooks/useChildCategories";
import { LabelEffortDialog } from "./dialogs/LabelEffortDialog";

export const NestedPlanAccordion = ({
  isBase,
  cat,
  reloadParent,
}: {
  cat: PlanningCategory;
  reloadParent: () => void;
  isBase?: boolean;
}) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const {
    toggle,
    hasChidlren,
    selected,
    categories,
    triggerReloadDB,
    deleteCategory,
    addChildCategory,
  } = useChildCategories({
    parent: cat,
    reloadParent,
  });

  return (
    <Pressable onPress={toggle}>
      <View style={styles.listItemContainer}>
        <Text
          style={{
            width: 150,
            ...(cat.completed && styles.completedText),
          }}
        >
          {hasChidlren && <Text>{selected ? "- " : "+ "}</Text>}
          {hasChidlren ? cat.label : `${cat.label} | ${cat.effort}`}
        </Text>
        <View style={styles.itemActionsContainer}>
          {isBase && (
            <Link
              href={{
                pathname: "/planner/edit/[id]",
                params: { id: cat.id },
              }}
              asChild
            >
              <Button>E</Button>
            </Link>
          )}
          <Button onPress={deleteCategory}>-</Button>
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
        onSubmit={addChildCategory}
        effort={0}
        defaultValue=""
        title="New Cat"
        triggerLabel="add"
        inputLabel="Cat Name"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  completedText: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  itemActionsContainer: {
    columnGap: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 35,
  },
});
