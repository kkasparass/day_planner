import { Image, StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Button, Divider } from "react-native-paper";
import { useEffect, useState } from "react";
import { TodoTimeline, TodoTimelineItem } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { TimelineItem } from "@/components/TimelineItem";

interface Todo {
  id: number;
  value: string;
  intValue: number;
}

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [todaoTimeline, setTodaoTimeline] = useState<TodoTimeline>();
  const [reloadDB, setReloadDB] = useState(true);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<TodoTimelineItem>(
        "SELECT * FROM todao_timeline ORDER BY id DESC"
      );
      setTodaoTimeline(result);
    }
    if (reloadDB) {
      setup();
      setReloadDB(false);
    }
  }, [reloadDB]);

  const handleNewDay = async () => {
    await db.runAsync(
      "INSERT INTO todao_timeline (date) VALUES (?)",
      `${new Date()}`
    );
    setReloadDB(true);
  };

  if (!todaoTimeline) {
    return null;
  }

  return (
    <ParallaxScrollView title="Todao">
      <Button
        mode="contained"
        style={{ width: "100%", height: 40 }}
        onPress={handleNewDay}
      >
        New Day
      </Button>

      <Divider />

      {todaoTimeline.map((todoDay) => (
        <TimelineItem
          timelineItem={todoDay}
          key={todoDay.id}
          reloadTimeline={() => setReloadDB(true)}
        />
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 50,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
