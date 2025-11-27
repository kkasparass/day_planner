import { View, Pressable } from "react-native";

import { Checkbox, Text, TextInput } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { PlanningCategory } from "@/types/types";
import { LabelEffortDialog } from "../dialogs/LabelEffortDialog";
import { useChildCategories } from "@/hooks/useChildCategories";

export const EditNestedPlanItem = ({
  cat,
  reloadParent,
}: {
  cat: PlanningCategory;
  reloadParent: () => void;
}) => {
  const db = useSQLiteContext();
  const { hasChidlren, categories, triggerReloadDB } = useChildCategories({
    parent: cat,
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [repeatFreqFreqInput, setRepeatFreqInput] = useState(cat.repeatFreq);

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
              reloadParent={triggerReloadDB}
            />
          ))}
      </View>
      <LabelEffortDialog
        isVisible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onSubmit={handleEditLabel}
        effort={cat.effort}
        defaultValue={cat.label}
        title="Edit Cat"
        inputLabel="Cat"
        triggerLabel="edit"
      />
    </>
  );
};
