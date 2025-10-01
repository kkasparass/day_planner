import { Routine, Routines } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

export const useRoutinesPage = () => {
  const db = useSQLiteContext();
  const [routines, setRoutines] = useState<Routines>();
  const [reloadDB, setReloadDB] = useState(true);
  const [newRoutinedialogVisible, setNewRoutineDialogVisible] = useState(false);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<Routine>(
        "SELECT * FROM routines ORDER BY id DESC"
      );
      setRoutines(result);
    }
    if (reloadDB) {
      setup();
      setReloadDB(false);
    }
  }, [reloadDB]);

  const openNewRoutineDialog = () => setNewRoutineDialogVisible(true);
  const closeNewRoutineDialog = () => setNewRoutineDialogVisible(false);
  const handleReloadDB = () => setReloadDB(true);

  const handleNewRoute = async (title: string) => {
    await db.runAsync("INSERT INTO routines (title) VALUES (?)", title ?? "");
    setReloadDB(true);
  };

  return {
    routines,
    newRoutinedialogVisible,
    handleNewRoute,
    openNewRoutineDialog,
    closeNewRoutineDialog,
    handleReloadDB,
  };
};
