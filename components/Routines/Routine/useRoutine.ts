import { reloadTodao } from "@/store/slices/todaosSlice";
import { PlanningCategory, Routine, RoutineItem } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

export const useRoutine = ({
  routine,
  reloadRoutines,
}: {
  routine: Routine;
  reloadRoutines: () => void;
}) => {
  const db = useSQLiteContext();
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);
  const [selectedRoutines, setSelectedRoutines] = useState<
    number[] | undefined
  >(undefined);
  const [reloadDB, setReloadDB] = useState(true);
  const [newDialogVisible, setNewDialogVisible] = useState(false);
  const [timelineListdialogVisible, setTimelineListDialogVisible] =
    useState(false);

  const dispatch = useDispatch();

  const totalRoutineEffort = useMemo(
    () =>
      routineItems.reduce((sum, todo) => {
        return sum + todo.effort;
      }, 0),
    [routineItems]
  );

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<RoutineItem>(
        `SELECT * FROM routine_items WHERE routineId = ${routine.id}
         ORDER BY
          id ASC;`
      );
      setRoutineItems(result);
    }
    if (reloadDB) {
      setup();
      setReloadDB(false);
    }
  }, [reloadDB]);

  const reloadRoutine = () => setReloadDB(true);
  const openNewRoutineDialog = () => setNewDialogVisible(true);
  const closeNewRoutineDialog = () => setNewDialogVisible(false);

  const openMergeDialog = () => setTimelineListDialogVisible(true);
  const closeMergeDialog = () => {
    setTimelineListDialogVisible(false);
    setSelectedRoutines(undefined);
  };

  const handleDeleteRoutine = async () => {
    await db.runAsync("DELETE FROM routines WHERE id = $id", {
      $id: routine.id,
    });
    reloadRoutines();
  };

  const createNewRoutine = async (label: string, cat?: PlanningCategory) => {
    await db.runAsync(
      "INSERT INTO routine_items (label, routineId, catId, effort) VALUES (?, ?, ?, ?)",
      label,
      routine.id,
      cat ? cat.id : null,
      cat?.effort || 0
    );
    setReloadDB(true);
  };

  const onSelectSpecificRoutine = (routineId: number) => {
    setSelectedRoutines([routineId]);
    setTimelineListDialogVisible(true);
  };

  const onMergeIntoTimelineItem = async (timelineId: number) => {
    const filteredRoutineItems = selectedRoutines
      ? routineItems.filter((routine) =>
          selectedRoutines.some((id) => id === routine.id)
        )
      : routineItems;
    filteredRoutineItems.forEach(async (routineItem) => {
      await db.runAsync(
        "INSERT INTO daily_todos (label, timelineId, catId, effort) VALUES (?, ?, ?, ?)",
        routineItem.label,
        timelineId,
        routineItem.catId ? routineItem.catId : null,
        routineItem.effort
      );
    });
    setTimelineListDialogVisible(false);
    dispatch(reloadTodao(timelineId));
    setSelectedRoutines(undefined);
  };

  return {
    totalRoutineEffort,
    routineItems,
    newDialogVisible,
    timelineListdialogVisible,
    handleDeleteRoutine,
    reloadRoutine,
    onSelectSpecificRoutine,
    openNewRoutineDialog,
    closeNewRoutineDialog,
    openMergeDialog,
    closeMergeDialog,
    createNewRoutine,
    onMergeIntoTimelineItem,
  };
};
