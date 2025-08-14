import { Pressable, StyleSheet, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Divider, Text } from "react-native-paper";
import { DailyTodo, PlanningCategory, TodoTimelineItem } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { TodayTask } from "../Task";
import { InputDialog } from "../dialogs/InputDialog";
import { NewTodaoDialog } from "../NewTodao/NewTodaoDialog";
import { STATUS_COLORS } from "@/constants/Colors";

export const TimelineItem = ({
  timelineItem,
  reloadTimeline,
}: {
  timelineItem: TodoTimelineItem;
  reloadTimeline: () => void;
}) => {
  const db = useSQLiteContext();
  const [dayTodos, setDayTodods] = useState<DailyTodo[]>([]);
  const [reloadDB, setReloadDB] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [enegryDialogVisible, setEnergyDialogVisible] = useState(false);

  const { date, energyCap, id } = timelineItem;

  const totalTodosEffort = useMemo(
    () =>
      dayTodos.reduce((sum, todo) => {
        return sum + todo.effort;
      }, 0),
    [dayTodos]
  );
  const energyColor = useMemo(() => {
    if (totalTodosEffort > energyCap) {
      return STATUS_COLORS.alert;
    }
    if (totalTodosEffort === energyCap) {
      return STATUS_COLORS.warning;
    }
    return STATUS_COLORS.success;
  }, [totalTodosEffort, energyCap]);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<DailyTodo>(
        `SELECT * FROM daily_todos WHERE timelineId = ${id}
         ORDER BY
          id ASC;`
      );
      setDayTodods(result);
    }
    if (reloadDB) {
      setup();
      setReloadDB(false);
    }
  }, [reloadDB]);

  const handleDeleteDay = async () => {
    await db.runAsync("DELETE FROM todao_timeline WHERE id = $id", {
      $id: id,
    });
    reloadTimeline();
  };

  const onTextSubmit = async (label: string, cat?: PlanningCategory) => {
    await db.runAsync(
      "INSERT INTO daily_todos (label, timelineId, catId, effort) VALUES (?, ?, ?, ?)",
      label,
      id,
      cat?.id ? cat.id : null,
      cat?.effort || 0
    );
  };

  const onEnergyCapChange = async (newValue: string) => {
    await db.runAsync("UPDATE todao_timeline SET energyCap = ? WHERE id = ?", [
      newValue,
      id,
    ]);
    reloadTimeline();
  };

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
            onPress={() => {
              setEnergyDialogVisible(true);
            }}
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
              reloadTodos={() => setReloadDB(true)}
            />
          ))}
          <Button
            mode="contained"
            style={{ marginTop: 20 }}
            onPress={() => setDialogVisible(true)}
          >
            + Add
          </Button>
        </Card.Content>
      </Card>
      <Divider />
      <InputDialog
        isVisible={enegryDialogVisible}
        onDismiss={() => setEnergyDialogVisible(false)}
        onTextSubmit={onEnergyCapChange}
        title="Edit Energy"
        keyboardType="numeric"
        defaultValue={String(energyCap)}
        triggerLabel="edit"
      ></InputDialog>
      <NewTodaoDialog
        energyCap={energyCap}
        currentEffortTotal={totalTodosEffort}
        isVisible={dialogVisible}
        onDismiss={() => {
          setDialogVisible(false);
        }}
        onTextSubmit={(label: string, cat?: PlanningCategory) => {
          onTextSubmit(label, cat);
          setReloadDB(true);
        }}
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
