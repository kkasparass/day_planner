import { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Checkbox, Text, TextInput } from "react-native-paper";
import { PlanningCategory } from "@/types/types";
import { useChildCategories } from "@/hooks/useChildCategories";
import { LabelEffortDialog } from "../dialogs/LabelEffortDialog";
import { useCategoryMutations } from "./useCategoryMutations";

export const EditNestedPlanItem = ({
  cat,
  reloadParent,
}: {
  cat: PlanningCategory;
  reloadParent: () => void;
}) => {
  const { hasChidlren, categories, triggerReloadDB } = useChildCategories({
    parent: cat,
    showCompleted: true,
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [repeatFreqFreqInput, setRepeatFreqInput] = useState(cat.repeatFreq);
  const { updateChecked, updateRepeatFreq, editLabel } = useCategoryMutations({
    category: cat,
    reloadParent,
  });

  return (
    <>
      <View style={styles.inputRowContainer}>
        <View style={styles.labelContainer}>
          <Checkbox
            status={cat.completed ? "checked" : "unchecked"}
            onPress={updateChecked}
          />
          <Pressable onPress={() => setDialogVisible(true)}>
            <Text style={cat.completed && styles.completedText}>
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
            updateRepeatFreq(Number(text));
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
        onSubmit={editLabel}
        effort={cat.effort}
        defaultValue={cat.label}
        title="Edit Cat"
        inputLabel="Cat"
        triggerLabel="edit"
      />
    </>
  );
};

const styles = StyleSheet.create({
  inputRowContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  labelContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  completedText: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
});
