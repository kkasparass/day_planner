import { Pressable, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { Button, Card, Divider, Text } from "react-native-paper";
import {
  DailyTodo,
  Routine as RoutineT,
  RoutineItem as RoutineItemT,
  TodoTimelineItem,
} from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { NewTodaoDialog } from "../NewTodao/NewTodaoDialog";
import { RoutineItem } from "./RoutineItem";
import { TimelineListDialog } from "./TimelineListDialog";

export const Routine = ({
  routine,
  reloadRoutines,
}: {
  routine: RoutineT;
  reloadRoutines: () => void;
}) => {
  const db = useSQLiteContext();
  const [dayTodos, setDayTodods] = useState<RoutineItemT[]>([]);
  const [reloadDB, setReloadDB] = useState(true);
  const [newDialogVisible, setNewDialogVisible] = useState(false);
  const [timelineListdialogVisible, setTimelineListDialogVisible] =
    useState(false);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<RoutineItemT>(
        `SELECT * FROM routine_items WHERE routineId = ${routine.id}
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

  const handleDeleteRoutine = async () => {
    await db.runAsync("DELETE FROM routines WHERE id = $id", {
      $id: routine.id,
    });
    reloadRoutines();
  };

  const onTextSubmit = async (label: string, catId?: number) => {
    await db.runAsync(
      "INSERT INTO routine_items (label, routineId, catId) VALUES (?, ?, ?)",
      label,
      routine.id,
      catId ? catId : null
    );
    setReloadDB(true);
  };

  const onMergeIntoTimelineItem = async (timelineId: number) => {
    dayTodos.forEach(async (routineItem) => {
      await db.runAsync(
        "INSERT INTO daily_todos (label, timelineId, catId) VALUES (?, ?, ?)",
        routineItem.label,
        timelineId,
        routineItem.catId ? routineItem.catId : null
      );
    });
    setTimelineListDialogVisible(false);
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
        <Text>{routine.title}</Text>
        <Button
          mode="contained"
          style={{ width: 25 }}
          onPress={handleDeleteRoutine}
        >
          -
        </Button>
      </View>
      <Card>
        <Card.Content
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          {dayTodos.map((routineItem) => (
            <RoutineItem
              routineItem={routineItem}
              key={routineItem.id}
              reloadTodos={() => setReloadDB(true)}
            />
          ))}
          <Button
            mode="contained"
            style={{ marginTop: 20 }}
            onPress={() => setNewDialogVisible(true)}
          >
            + Add
          </Button>
          <Button
            mode="contained"
            onPress={() => setTimelineListDialogVisible(true)}
          >
            Add to
          </Button>
        </Card.Content>
      </Card>
      <Divider />
      <NewTodaoDialog
        isVisible={newDialogVisible}
        onDismiss={() => {
          setNewDialogVisible(false);
          setReloadDB(true);
        }}
        onTextSubmit={onTextSubmit}
      />
      <TimelineListDialog
        isVisible={timelineListdialogVisible}
        onDismiss={() => {
          setTimelineListDialogVisible(false);
        }}
        onTimelineSelect={onMergeIntoTimelineItem}
      />
    </View>
  );
};
