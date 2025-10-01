import { RoutineItem } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";

export const useRoutineItem = ({
  routineItem,
  reloadRoutine,
  onSelectRoutine,
}: {
  routineItem: RoutineItem;
  reloadRoutine: () => void;
  onSelectRoutine: (specificRoutine: number) => void;
}) => {
  const db = useSQLiteContext();
  const [editDialogVisible, setEditDialogVisible] = useState(false);

  const { id } = routineItem;

  const openEditDialog = () => setEditDialogVisible(true);
  const closeEditDialog = () => setEditDialogVisible(false);

  const handleDelete = async () => {
    await db.runAsync("DELETE FROM routine_items WHERE id = $id", { $id: id });
    reloadRoutine();
  };

  const handleEditLabel = async (label: string, effort: number) => {
    await db.runAsync(
      "UPDATE routine_items SET label = ?, effort = ? WHERE id = ?",
      [label, effort, id]
    );
    reloadRoutine();
  };

  const handleRoutineLongPress = () => {
    onSelectRoutine(id);
  };

  return {
    editDialogVisible,
    handleDelete,
    handleEditLabel,
    openEditDialog,
    closeEditDialog,
    handleRoutineLongPress,
  };
};
