import { Pressable, StyleSheet, View } from "react-native";
import { Badge, Checkbox, IconButton, Text } from "react-native-paper";
import { DailyTodo } from "@/types/types";
import { LabelEffortDialog } from "../dialogs/LabelEffortDialog";
import { useTask } from "./useTask";

export const Task = ({
  todo,
  dayDate,
  reloadTodos,
}: {
  todo: DailyTodo;
  reloadTodos: () => void;
  dayDate: string;
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
        <Checkbox
          status={completed ? "checked" : "unchecked"}
          onPress={handleUpdateChecked}
        />
        <Pressable onPress={openEditDialog}>
          <Text style={{ width: 170 }}>{todo.label}</Text>
        </Pressable>
      </View>
      <View style={styles.taskActionsContainer}>
        {catId && <IconButton icon="check" onPress={handlePlanCompleted} />}
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
  },
  badge: { position: "absolute", top: -7, right: -15 },
  taskActionsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
