import { Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import { Badge, Button, Checkbox, IconButton, Text } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { RoutineItem as RoutineItemT } from "@/types/types";
import { EditCatDialog } from "../dialogs/EditCatDialog";

export const RoutineItem = ({
  routineItem,
  reloadTodos,
}: {
  routineItem: RoutineItemT;
  reloadTodos: () => void;
}) => {
  const db = useSQLiteContext();
  const [dialogVisible, setDialogVisible] = useState(false);

  const { id, effort } = routineItem;

  const handleDelete = async () => {
    await db.runAsync("DELETE FROM routine_items WHERE id = $id", { $id: id });
    reloadTodos();
  };

  const handleEditLabel = async (label: string, effort: number) => {
    await db.runAsync(
      "UPDATE routine_items SET label = ?, effort = ? WHERE id = ?",
      [label, effort, id]
    );
    reloadTodos();
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center",
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
        <Pressable onPress={() => setDialogVisible(true)}>
          <Text style={{ width: 250 }}>{routineItem.label}</Text>
        </Pressable>
      </View>

      <IconButton icon="close" onPress={handleDelete} />
      <EditCatDialog
        isVisible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onSubmit={handleEditLabel}
        effort={routineItem.effort}
        label={routineItem.label}
        title="Edit item"
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
