import { ScrollView, StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Button } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";

export default function SettingsPage() {
  const db = useSQLiteContext();

  const backup = async (backupName: string) => {
    // try {
    //   await db.execAsync("PRAGMA wal_checkpoint(FULL)");
    //   const appPath = FileSystem.documentDirectory;
    //   const dbPath = `${appPath}/SQLite/${db.databaseName}`;
    //   const backupPath = `${appPath}/SQLite/${backupName}`;
    //   await FileSystem.copyAsync({
    //     from: dbPath,
    //     to: backupPath,
    //   });
    //   await Sharing.shareAsync(backupPath, {
    //     mimeType: "application/x-sqlite3",
    //   });
    // } catch (error) {
    //   alert(error);
    // }
  };

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
      <ScrollView>
        <View style={{ display: "flex", gap: 16 }}>
          <Button mode="contained" onPress={() => backup("test-db")}>
            Backup all data
          </Button>
          <Button mode="contained" onPress={() => {}}>
            Restore data
          </Button>
          <View style={{ marginBottom: 1000 }} />
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
        </View>
      </ScrollView>
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
