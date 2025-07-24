import { FlatList, Image, StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Button, Divider } from "react-native-paper";
import { useEffect, useState } from "react";
import { TodoTimeline, TodoTimelineItem } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { TimelineItem } from "@/components/TodaoTimeline/TimelineItem";

// Add an energy level for each todao, and effort values for todaos + planned items. The effort cap will be displayed by the border of the todao?
// We'll want to warn the todao list Of the current totals already added. All of the values should be updatable for each day

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

      <FlatList
        data={todaoTimeline}
        renderItem={({ item: todoDay }) => (
          <TimelineItem
            timelineItem={todoDay}
            key={todoDay.id}
            reloadTimeline={() => setReloadDB(true)}
          />
        )}
        keyExtractor={(item) => `${item.id}`}
      />
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
