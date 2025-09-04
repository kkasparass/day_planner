import { View, Pressable } from "react-native";

import { Checkbox, Text, TextInput } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { PlanningCategories, PlanningCategory } from "@/types/types";
import { InputDialog } from "../dialogs/InputDialog";
import { Link } from "expo-router";
import { LabelEffortDialog } from "../dialogs/LabelEffortDialog";

export const EditNestedPlanItem = ({
  cat,
  reloadParent,
}: {
  cat: PlanningCategory;
  reloadParent: () => void;
}) => {
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<PlanningCategories>([]);
  const [reloadDB, setReloadDB] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [repeatFreqFreqInput, setRepeatFreqInput] = useState(cat.repeatFreq);

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

  const handleUpdateChecked = async () => {
    await db.runAsync(
      "UPDATE planning_categories SET completed = ? WHERE id = ?",
      [!cat.completed, cat.id]
    );
    reloadParent();
  };

  const handleUpdateRepeatFreq = async (input: number) => {
    await db.runAsync(
      "UPDATE planning_categories SET repeatFreq = ? WHERE id = ?",
      [input, cat.id]
    );
  };

  const handleEditLabel = async (label: string, effort: number) => {
    await db.runAsync(
      "UPDATE planning_categories SET label = ?, effort = ? WHERE id = ?",
      [label, effort, cat.id]
    );
    reloadParent();
  };

  const hasChidlren = categories.length > 0;

  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: 5,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Checkbox
            status={cat.completed ? "checked" : "unchecked"}
            onPress={handleUpdateChecked}
          />
          <Pressable onPress={() => setDialogVisible(true)}>
            <Text
              style={
                cat.completed && {
                  textDecorationLine: "line-through",
                  textDecorationStyle: "solid",
                }
              }
            >
              {cat.label} | {cat.effort}
            </Text>
          </Pressable>
        </View>
        <TextInput
          style={{ width: "25%" }}
          label="RepeatFreq"
          keyboardType="numeric"
          defaultValue={repeatFreqFreqInput ? `${repeatFreqFreqInput}` : ""}
          onChangeText={(text) => {
            handleUpdateRepeatFreq(Number(text));
            setRepeatFreqInput(Number(text));
          }}
        />
      </View>
      <View style={{ marginLeft: 20 }}>
        {hasChidlren &&
          categories.map((child) => (
            <EditNestedPlanItem
              cat={child}
              key={child.id}
              reloadParent={() => setReloadDB(true)}
            />
          ))}
      </View>
      <LabelEffortDialog
        isVisible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onSubmit={handleEditLabel}
        effort={cat.effort}
        label={cat.label}
        title="Edit Cat"
        inputLabel="Cat"
      />
    </>
  );
};
