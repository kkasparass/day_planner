import { DailyTodo } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";

export const useTask = ({
  todo,
  dayDate,
  reloadTodos,
}: {
  todo: DailyTodo;
  reloadTodos: () => void;
  dayDate: string;
}) => {
  const db = useSQLiteContext();
  const [editDialogVisible, setEditDialogVisible] = useState(false);

  const { id, completed, catId } = todo;

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

  const handleEditTask = async (label: string, effort: number) => {
    await db.runAsync(
      "UPDATE daily_todos SET label = ?, effort = ? WHERE id = ?",
      [label, effort, id]
    );
    reloadTodos();
  };

  const openEditDialog = () => setEditDialogVisible(true);
  const closeEditDialog = () => setEditDialogVisible(false);

  return {
    editDialogVisible,
    handleUpdateChecked,
    handlePlanCompleted,
    handleDelete,
    handleEditTask,
    openEditDialog,
    closeEditDialog,
  };
};
