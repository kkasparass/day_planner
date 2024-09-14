import { Pressable, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { Button, Card, Divider, Text } from "react-native-paper";
import { DailyTodo, TodoTimelineItem } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { TodayTask } from "./Task";
import { InputDialog } from "./InputDialog";
import { NewTodaoDialog } from "./NewTodao/NewTodaoDialog";

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

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<DailyTodo>(
        `SELECT * FROM daily_todos WHERE timelineId = ${timelineItem.id}
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
      $id: timelineItem.id,
    });
    reloadTimeline();
  };

  const onTextSubmit = async (label: string, catId?: number) => {
    console.log(catId);
    await db.runAsync(
      "INSERT INTO daily_todos (label, timelineId, catId) VALUES (?, ?, ?)",
      label,
      timelineItem.id,
      catId ? catId : null
    );
    setReloadDB(true);
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
        <Text>{new Date(timelineItem.date).toDateString()}</Text>
        <Button
          mode="contained"
          style={{ width: 25 }}
          onPress={handleDeleteDay}
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
          {dayTodos.map((todo) => (
            <TodayTask
              todo={todo}
              key={todo.id}
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
      <NewTodaoDialog
        isVisible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onTextSubmit={onTextSubmit}
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
