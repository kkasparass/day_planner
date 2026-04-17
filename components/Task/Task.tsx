import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Badge, Checkbox, IconButton, Text } from "react-native-paper";
import { DailyTodo } from "@/types/types";
import { LabelEffortDialog } from "../dialogs/LabelEffortDialog";
import { useTask } from "./useTask";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DragGesture, DragHandle } from "@/components/DraggableList/DraggableList";

export const Task = ({
  todo,
  isActive,
  dayDate,
  reloadTodos,
  drag,
}: {
  todo: DailyTodo;
  isActive: boolean;
  dayDate: string;
  reloadTodos: () => void;
  drag?: DragGesture;
}) => {
  const { completed, catId, effort } = todo;
  const {
    editDialogVisible,
    handleUpdateChecked,
    handlePlanCompleted,
    handleDelete,
    handleEditTask,
    openEditDialog,
    closeEditDialog,
  } = useTask({
    todo,
    dayDate,
    reloadTodos,
  });

  return (
    <View style={styles.taskRow}>
      <View style={styles.infoContainer}>
        {effort > 0 && (
          <Badge style={styles.badge} size={17}>
            {effort}
          </Badge>
        )}
        {!completed && drag && (
          <DragHandle gesture={drag}>
            <Ionicons
              name="reorder-four-outline"
              color={isActive ? "rgba(255,255,255,0.4)" : "white"}
              size={24}
            />
          </DragHandle>
        )}
        <Checkbox
          status={completed ? "checked" : "unchecked"}
          onPress={handleUpdateChecked}
        />
        <Pressable
          style={{ flexShrink: 1, flexGrow: 1 }}
          onPress={openEditDialog}
        >
          <Text>{todo.label}</Text>
        </Pressable>
      </View>
      <View style={styles.taskActionsContainer}>
        {catId ? (
          <IconButton icon="check" onPress={handlePlanCompleted} />
        ) : (
          <View style={{ width: 51 }} />
        )}
        <IconButton icon="close" onPress={handleDelete} />
      </View>
      <LabelEffortDialog
        isVisible={editDialogVisible}
        onDismiss={closeEditDialog}
        onSubmit={handleEditTask}
        effort={todo.effort}
        defaultValue={todo.label}
        title="Edit Todo"
        triggerLabel="edit"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  taskRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    position: "relative",
    flexShrink: 1,
  },
  badge: { position: "absolute", top: -7, right: -10 },
  taskActionsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
