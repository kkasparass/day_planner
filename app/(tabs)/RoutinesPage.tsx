import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, FlatList } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Button, Divider } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Routine as RoutineT, Routines } from "@/types/types";
import { InputDialog } from "@/components/dialogs/InputDialog";
import { Routine } from "@/components/Routines/Routine";

export default function RoutinesPage() {
  const db = useSQLiteContext();
  const [todaoTimeline, setTodaoTimeline] = useState<Routines>();
  const [reloadDB, setReloadDB] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<RoutineT>(
        "SELECT * FROM routines ORDER BY id DESC"
      );
      setTodaoTimeline(result);
    }
    if (reloadDB) {
      setup();
      setReloadDB(false);
    }
  }, [reloadDB]);

  const handleNewRoute = async (title: string) => {
    await db.runAsync("INSERT INTO routines (title) VALUES (?)", title ?? "");
    setReloadDB(true);
  };

  if (!todaoTimeline) {
    return null;
  }

  return (
    <ParallaxScrollView title="Routines">
      <Button
        mode="contained"
        style={{ width: "100%", height: 40 }}
        onPress={() => setDialogVisible(true)}
      >
        New Routine
      </Button>

      <Divider />

      <FlatList
        data={todaoTimeline}
        renderItem={({ item: routine }) => (
          <Routine
            routine={routine}
            key={routine.id}
            reloadRoutines={() => setReloadDB(true)}
          />
        )}
        keyExtractor={(item) => `${item.id}`}
      />

      <InputDialog
        isVisible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onTextSubmit={handleNewRoute}
        title="Add Routine"
        inputLabel="Routine Title"
        triggerLabel="Add"
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
