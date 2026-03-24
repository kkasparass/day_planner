import { StyleSheet, View } from "react-native";
import { Button, Card, Divider, Text } from "react-native-paper";
import { NewTodaoDialog } from "../../NewTodao/NewTodaoDialog";
import { RoutineItem } from "../RoutineItem/RoutineItem";
import { TimelineListDialog } from "../TimelineListDialog/TimelineListDialog";
import { useRoutine } from "./useRoutine";
import { Routine as RoutineT } from "@/types/types";
import {
  NestableDraggableFlatList,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

export const Routine = ({
  routine,
  reloadRoutines,
}: {
  routine: RoutineT;
  reloadRoutines: () => void;
}) => {
  const {
    newDialogVisible,
    totalRoutineEffort,
    routineItems,
    timelineListdialogVisible,
    handleDeleteRoutine,
    reloadRoutine,
    onSelectSpecificRoutine,
    openNewRoutineDialog,
    closeNewRoutineDialog,
    openMergeDialog,
    closeMergeDialog,
    createNewRoutine,
    onMergeIntoTimelineItem,
    onRoutineSelect,
    updateRoutineItemOrder,
  } = useRoutine({
    routine,
    reloadRoutines,
  });

  return (
    <View style={styles.routineListItem}>
      <View style={styles.itemHeader}>
        <Text>
          {routine.title} | {totalRoutineEffort}
        </Text>
        <Button
          mode="contained"
          style={{ width: 25 }}
          onPress={handleDeleteRoutine}
        >
          -
        </Button>
      </View>
      <Card>
        <Card.Content style={styles.cardContent}>
          <NestableDraggableFlatList
            data={routineItems}
            onDragEnd={({ data, from, to }) => {
              updateRoutineItemOrder(data, from, to);
            }}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({ item: routineItem, drag, isActive }) => (
              <ScaleDecorator>
                <RoutineItem
                  routineItem={routineItem}
                  reloadRoutine={reloadRoutine}
                  onSelectRoutine={onSelectSpecificRoutine}
                  drag={drag}
                  isActive={isActive}
                />
              </ScaleDecorator>
            )}
          />
          <Button
            mode="contained"
            style={{ marginTop: 20 }}
            onPress={openNewRoutineDialog}
          >
            + Add
          </Button>
          <Button mode="contained" onPress={openMergeDialog}>
            Add to
          </Button>
        </Card.Content>
      </Card>
      <Divider />
      <NewTodaoDialog
        isVisible={newDialogVisible}
        onDismiss={() => {
          closeNewRoutineDialog();
          reloadRoutine();
        }}
        onTextSubmit={createNewRoutine}
        energyCap={100}
        currentEffortTotal={totalRoutineEffort}
        onRoutineSelect={onRoutineSelect}
      />
      <TimelineListDialog
        isVisible={timelineListdialogVisible}
        onDismiss={closeMergeDialog}
        onTimelineSelect={onMergeIntoTimelineItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  routineListItem: {
    display: "flex",
    gap: 15,
    marginBottom: 16,
  },
  itemHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContent: {
    display: "flex",
    gap: 10,
  },
});
