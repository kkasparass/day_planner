import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Button } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";

export default function SettingsPage() {
  const db = useSQLiteContext();

  const deleteAll = async () => {
    await db.execAsync(`
      DELETE FROM todao_timeline;
      Delete FROM daily_todos;
      Delete FROM planning_categories;
    `);
  };
  const deleteTimeline = async () => {
    await db.execAsync(`
      DELETE FROM todao_timeline;
    `);
  };
  const deleteTodos = async () => {
    await db.execAsync(`
      DELETE FROM daily_todos;
    `);
  };
  const deleteCategories = async () => {
    await db.execAsync(`
      DELETE FROM planning_categories;
    `);
  };

  return (
    <ParallaxScrollView title="Settings">
      <Button mode="contained" onPress={deleteAll}>
        Deleta all data
      </Button>
      <Button mode="contained" onPress={deleteTimeline}>
        Deleta timeline
      </Button>
      <Button mode="contained" onPress={deleteTodos}>
        Deleta individual todos
      </Button>
      <Button mode="contained" onPress={deleteCategories}>
        Deleta all categories
      </Button>
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
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
