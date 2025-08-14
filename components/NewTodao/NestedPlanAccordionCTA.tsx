import { View, Pressable } from "react-native";

import { Text } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { PlanningCategories, PlanningCategory } from "@/types/types";
import { AddFromPlanButton } from "./AddFromPlanButton";
import { add, differenceInDays } from "date-fns";

const resolveDaysOver = (repeatFreq: number, lastDone: Date | null): number => {
  if (repeatFreq === 0) {
    return -10;
  }
  if (lastDone === null) {
    return 1;
  }
  const today = new Date();
  const repeatBy = add(lastDone, { days: repeatFreq });
  return differenceInDays(today, repeatBy);
};

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
  const [selected, setselected] = useState(true);
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<PlanningCategories>([]);
  const [reloadDB, setReloadDB] = useState(true);

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
