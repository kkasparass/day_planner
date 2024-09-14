import { Pressable, StyleSheet, View } from "react-native";
import { DailyTodo } from "../types/types";
import { useState } from "react";
import { Button, Checkbox, Text } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";

export const TodayTask = ({
  todo,
  reloadTodos,
}: {
  todo: DailyTodo;
  reloadTodos: () => void;
}) => {
  const db = useSQLiteContext();

  const { id, completed, catId } = todo;

  const handleUpdateChecked = async () => {
    await db.runAsync("UPDATE daily_todos SET completed = ? WHERE id = ?", [
      !completed,
      id,
    ]);
    if (catId) {
      await db.runAsync(
        "UPDATE planning_categories SET lastDone = ? WHERE id = ?",
        [`${new Date()}`, catId]
      );
    }
    reloadTodos();
  };

  const handleDelete = async () => {
    await db.runAsync("DELETE FROM daily_todos WHERE id = $id", { $id: id });
    reloadTodos();
  };

  return (
    <Pressable
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onPress={() => handleUpdateChecked()}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Checkbox status={completed ? "checked" : "unchecked"} />
        <Text>{todo.label}</Text>
      </View>
      <Button
        mode="contained"
        style={{ width: 50, height: "100%" }}
        onPress={handleDelete}
      >
        -
      </Button>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
