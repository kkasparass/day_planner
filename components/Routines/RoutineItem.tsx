import { Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  IconButton,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { RoutineItem as RoutineItemT } from "@/types/types";
import { LabelEffortDialog } from "../dialogs/LabelEffortDialog";

export const RoutineItem = ({
  routineItem,
  reloadRoutine,
  onSelectRoutine,
}: {
  routineItem: RoutineItemT;
  reloadRoutine: () => void;
  onSelectRoutine: (specificRoutine: number) => void;
}) => {
  const db = useSQLiteContext();
  const [dialogVisible, setDialogVisible] = useState(false);

  const { id, effort } = routineItem;

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
      <TouchableRipple
        rippleColor="rgba(255, 255, 255, 0.32)"
        onPress={() => setDialogVisible(true)}
        onLongPress={() => {
          onSelectRoutine(id);
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
            flex: 1,
          }}
        >
          {effort > 0 && (
            <Badge
              style={{ position: "absolute", top: 0, right: -15 }}
              size={17}
            >
              {effort}
            </Badge>
          )}

          <Text style={{ width: 250 }}>{routineItem.label}</Text>
        </View>
      </TouchableRipple>

      <IconButton icon="close" onPress={handleDelete} />
      <LabelEffortDialog
        isVisible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onSubmit={handleEditLabel}
        effort={routineItem.effort}
        label={routineItem.label}
        title="Edit item"
        inputLabel="Routine Title"
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
