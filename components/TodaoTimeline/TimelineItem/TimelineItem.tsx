import { StyleSheet, View } from "react-native";
import { Button, Card, Divider, ProgressBar, Text } from "react-native-paper";
import { TodoTimelineItem } from "@/types/types";
import { Colors, STATUS_COLORS } from "@/constants/Colors";
import {
  NestableDraggableFlatList,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { useTimelineItem } from "./useTimelineItem";
import { InputDialog } from "@/components/dialogs/InputDialog";
import { NewTodaoDialog } from "@/components/NewTodao/NewTodaoDialog";
import { Task } from "@/components/Task/Task";

export const TimelineItem = ({
  timelineItem,
}: {
  timelineItem: TodoTimelineItem;
}) => {
  const { date, energyCap } = timelineItem;
  const {
    undoneTodos,
    completedTodos,
    enegryDialogVisible,
    todaoDialogVisible,
    totalTodosEffort,
    dayProgressValue,
    energyColor,
    openEnergyDialog,
    closeEnergyDialog,
    openTodaoDialog,
    closeTodaoDialog,
    handleDeleteDay,
    onTextSubmit,
    onEnergyCapChange,
    handleReloadDB,
    onRoutineSelect,
    updateUndoneTodoOrder,
  } = useTimelineItem({ timelineItem });

  return (
    <View style={styles.itemBlock}>
      <View style={styles.itemHeader}>
        <Text>
          {new Date(date).toDateString()} | {totalTodosEffort}
        </Text>
        <View style={styles.itemsActionsContainer}>
          <Button
            mode="contained"
            style={{ backgroundColor: energyColor }}
            onPress={openEnergyDialog}
          >
            {energyCap}
          </Button>
          <Button
            mode="contained"
            style={{ width: 25 }}
            onPress={handleDeleteDay}
          >
            -
          </Button>
        </View>
      </View>
      <ProgressBar
        progress={dayProgressValue}
        color={STATUS_COLORS.success}
        visible={energyCap > 0}
      />
      <Card>
        <Card.Content style={styles.todaoCardContainer}>
          <NestableDraggableFlatList
            data={undoneTodos}
            onDragEnd={({ data, from, to }) => {
              updateUndoneTodoOrder(data, from, to);
            }}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({ item: todo, drag, isActive }) => (
              <ScaleDecorator>
                <View
                  style={
                    isActive && { backgroundColor: `${Colors.dark.text}20` }
                  }
                >
                  <Task
                    todo={todo}
                    key={todo.id}
                    dayDate={date}
                    reloadTodos={handleReloadDB}
                    drag={drag}
                    isActive={isActive}
                  />
                </View>
              </ScaleDecorator>
            )}
          />
          {completedTodos.length > 0 && (
            <>
              <Divider />
              {completedTodos.map((todo) => (
                <Task
                  todo={todo}
                  key={todo.id}
                  dayDate={date}
                  reloadTodos={handleReloadDB}
                  isActive={false}
                  drag={() => {}}
                />
              ))}
            </>
          )}

          <Button
            mode="contained"
            style={{ marginTop: 20 }}
            onPress={openTodaoDialog}
          >
            + Add
          </Button>
        </Card.Content>
      </Card>
      <Divider />
      <InputDialog
        isVisible={enegryDialogVisible}
        onDismiss={closeEnergyDialog}
        onTextSubmit={onEnergyCapChange}
        title="Edit Energy"
        keyboardType="numeric"
        defaultValue={String(energyCap)}
        triggerLabel="edit"
        inputLabel="Energy Value"
      />
      <NewTodaoDialog
        energyCap={energyCap}
        currentEffortTotal={totalTodosEffort}
        isVisible={todaoDialogVisible}
        onDismiss={closeTodaoDialog}
        onTextSubmit={onTextSubmit}
        onRoutineSelect={onRoutineSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemBlock: {
    display: "flex",
    gap: 16,
    marginBottom: 16,
  },
  itemHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemsActionsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  todaoCardContainer: {
    display: "flex",
    gap: 10,
  },
});
