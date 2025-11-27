import { View, Pressable, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { PlanningCategory } from "@/types/types";
import { useChildCategories } from "@/hooks/useChildCategories";
import { AddFromPlanButton } from "../AddFromPlanButton/AddFromPlanButton";
import { resolveDaysOver } from "./utils";

export const NestedPlanAccordionCTA = ({
  cat,
  onTextSubmit,
  energyCap,
  currentEffortTotal,
}: {
  cat: PlanningCategory;
  onTextSubmit: (label: string, cat?: PlanningCategory) => void;
  energyCap: number;
  currentEffortTotal: number;
}) => {
  const { toggle, hasChidlren, selected, categories } = useChildCategories({
    parent: cat,
  });

  return (
    <Pressable onPress={toggle}>
      <View style={styles.listItemContainer}>
        {hasChidlren ? (
          <Text style={cat.completed && styles.completedText}>
            {cat.label} {selected ? "-" : "+"}
          </Text>
        ) : (
          <AddFromPlanButton
            onPress={() => onTextSubmit(cat.label, cat)}
            label={cat.label}
            lastDone={cat.lastDone ? new Date(cat.lastDone).toDateString() : ""}
            effort={cat.effort}
            daysOver={resolveDaysOver(
              cat.repeatFreq ?? 0,
              cat.lastDone ? new Date(cat.lastDone) : null
            )}
            energyCap={energyCap}
            currentEffortTotal={currentEffortTotal}
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
                energyCap={energyCap}
                currentEffortTotal={currentEffortTotal}
              />
            ))}
        </View>
      )}
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
});
