import { StyleSheet, View } from "react-native";
import { Badge, IconButton, Text, TouchableRipple } from "react-native-paper";
import { RoutineItem as RoutineItemT } from "@/types/types";
import { LabelEffortDialog } from "../../dialogs/LabelEffortDialog";
import { useRoutineItem } from "./useRoutineItem";

export const RoutineItem = ({
  routineItem,
  reloadRoutine,
  onSelectRoutine,
}: {
  routineItem: RoutineItemT;
  reloadRoutine: () => void;
  onSelectRoutine: (specificRoutine: number) => void;
}) => {
  const { id, effort } = routineItem;
  const {
    editDialogVisible,
    handleDelete,
    handleEditLabel,
    openEditDialog,
    closeEditDialog,
    handleRoutineLongPress,
  } = useRoutineItem({ routineItem, reloadRoutine, onSelectRoutine });

  return (
    <View style={styles.routineItemRow}>
      <TouchableRipple
        rippleColor="rgba(255, 255, 255, 0.32)"
        onPress={openEditDialog}
        onLongPress={handleRoutineLongPress}
      >
        <View style={styles.routineText}>
          {effort > 0 && (
            <Badge style={styles.badge} size={17}>
              {effort}
            </Badge>
          )}

          <Text style={{ width: 250 }}>{routineItem.label}</Text>
        </View>
      </TouchableRipple>

      <IconButton icon="close" onPress={handleDelete} />
      <LabelEffortDialog
        isVisible={editDialogVisible}
        onDismiss={closeEditDialog}
        onSubmit={handleEditLabel}
        effort={routineItem.effort}
        defaultValue={routineItem.label}
        title="Edit item"
        inputLabel="Routine Title"
        triggerLabel="edit"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  routineItemRow: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  routineText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    flex: 1,
  },
  badge: { position: "absolute", top: 0, right: -15 },
});
