import { Pressable, StyleSheet, View } from "react-native";
import { DailyTodo } from "../types/types";
import { useState } from "react";
import { Badge, Button, Checkbox, IconButton, Text } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { EditCatDialog } from "./dialogs/EditCatDialog";

export const TodayTask = ({
  todo,
  dayDate,
  reloadTodos,
}: {
  todo: DailyTodo;
  reloadTodos: () => void;
  dayDate: string;
}) => {
  const db = useSQLiteContext();
  const [dialogVisible, setDialogVisible] = useState(false);

  const { id, completed, catId, effort } = todo;

  const handleUpdateChecked = async () => {
    await db.runAsync("UPDATE daily_todos SET completed = ? WHERE id = ?", [
      !completed,
      id,
    ]);
    if (catId) {
      await db.runAsync(
        "UPDATE planning_categories SET lastDone = ? WHERE id = ?",
        [dayDate, catId]
      );
    }
    reloadTodos();
  };

  const handlePlanCompleted = async () => {
    await db.runAsync("UPDATE daily_todos SET completed = ? WHERE id = ?", [
      1,
      id,
    ]);
    await db.runAsync(
      "UPDATE planning_categories SET completed = ?, lastDone = ? WHERE id = ?",
      [1, dayDate, catId]
    );
    reloadTodos();
  };

  const handleDelete = async () => {
    await db.runAsync("DELETE FROM daily_todos WHERE id = $id", { $id: id });
    reloadTodos();
  };

  const handleEditLabel = async (label: string, effort: number) => {
    await db.runAsync(
      "UPDATE daily_todos SET label = ?, effort = ? WHERE id = ?",
      [label, effort, id]
    );
    reloadTodos();
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          position: "relative",
        }}
      >
        {effort > 0 && (
          <Badge
            style={{ position: "absolute", top: -7, right: -15 }}
            size={17}
          >
            {effort}
          </Badge>
        )}
        <Checkbox
          status={completed ? "checked" : "unchecked"}
          onPress={handleUpdateChecked}
        />
        <Pressable onPress={() => setDialogVisible(true)}>
          <Text style={{ width: 170 }}>{todo.label}</Text>
        </Pressable>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {catId && <IconButton icon="check" onPress={handlePlanCompleted} />}
        <IconButton icon="close" onPress={handleDelete} />
      </View>
      <EditCatDialog
        isVisible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onSubmit={handleEditLabel}
        effort={todo.effort}
        label={todo.label}
        title="Edit Todo"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
