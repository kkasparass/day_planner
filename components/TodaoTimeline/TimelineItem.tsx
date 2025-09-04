import { View } from "react-native";
import { Button, Card, Divider, ProgressBar, Text } from "react-native-paper";
import { PlanningCategory, TodoTimelineItem } from "@/types/types";
import { TodayTask } from "../Task";
import { InputDialog } from "../dialogs/InputDialog";
import { NewTodaoDialog } from "../NewTodao/NewTodaoDialog";
import { STATUS_COLORS } from "@/constants/Colors";
import { useTimelineItem } from "./useTimelineItem";

export const TimelineItem = ({
  timelineItem,
  reloadTimeline,
}: {
  timelineItem: TodoTimelineItem;
  reloadTimeline: () => void;
}) => {
  const { date, energyCap } = timelineItem;
  const {
    dayTodos,
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
  } = useTimelineItem({ timelineItem, reloadTimeline });

  return (
    <View
      style={{
        display: "flex",
        gap: 15,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text>{new Date(date).toDateString()}</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
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
        <Card.Content
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          {dayTodos.map((todo) => (
            <TodayTask
              todo={todo}
              key={todo.id}
              dayDate={date}
              reloadTodos={handleReloadDB}
            />
          ))}
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
      ></InputDialog>
      <NewTodaoDialog
        energyCap={energyCap}
        currentEffortTotal={totalTodosEffort}
        isVisible={todaoDialogVisible}
        onDismiss={closeTodaoDialog}
        onTextSubmit={(label: string, cat?: PlanningCategory) => {
          onTextSubmit(label, cat);
          handleReloadDB();
        }}
      />
    </View>
  );
};
