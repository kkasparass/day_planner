import { reloadTodao } from "@/store/slices/todaosSlice";
import { PlanningCategory, Routine, RoutineItem } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useMemo, useState } from "react";
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
    [routineItems],
  );

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<RoutineItem>(
        `SELECT * FROM routine_items WHERE routineId = ${routine.id}
         ORDER BY
          itemOrder ASC;`,
      );
      setRoutineItems(result);
    }
    if (reloadDB) {
      setup();
      setReloadDB(false);
    }
  }, [reloadDB, db, routine.id]);

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
      cat?.effort || 0,
    );
    setReloadDB(true);
  };

  const onSelectSpecificRoutine = (routineId: number) => {
    setSelectedRoutines([routineId]);
    setTimelineListDialogVisible(true);
  };

  const onMergeIntoTimelineItem = async (timelineId: number) => {
    const itemFilter = selectedRoutines
      ? `AND id IN (${selectedRoutines.join(",")})`
      : "";
    await db.runAsync(
      `INSERT INTO daily_todos (label, timelineId, catId, effort)
       SELECT label, ${timelineId}, catId, effort FROM routine_items
       WHERE routineId = ${routine.id} ${itemFilter}
       ORDER BY itemOrder ASC`,
    );
    setTimelineListDialogVisible(false);
    dispatch(reloadTodao(timelineId));
    setSelectedRoutines(undefined);
  };

  const updateRoutineItemOrder = useCallback(
    (data: RoutineItem[], from: number, to: number) => {
      const initialItem = routineItems[from];
      const initialItemOrder = routineItems[from].itemOrder;
      const targetItemOrder = routineItems[to].itemOrder;

      if (initialItemOrder === targetItemOrder) return;
      if (initialItemOrder < targetItemOrder) {
        db.execAsync(
          `
        UPDATE routine_items
        SET itemOrder = itemOrder - 1
        WHERE routineId = ${initialItem.routineId} AND itemOrder BETWEEN ${initialItemOrder} AND ${targetItemOrder};

        UPDATE routine_items
        SET itemOrder = ${targetItemOrder}
        WHERE id = ${initialItem.id};`,
        );

        setRoutineItems(
          data.map((item) => {
            if (item.id === initialItem.id) {
              return { ...item, itemOrder: targetItemOrder };
            }
            if (
              item.itemOrder >= initialItemOrder &&
              item.itemOrder <= targetItemOrder
            ) {
              return { ...item, itemOrder: item.itemOrder - 1 };
            }
            return item;
          }),
        );
      }
      if (initialItemOrder > targetItemOrder) {
        db.execAsync(
          `
        UPDATE routine_items
        SET itemOrder = itemOrder + 1
        WHERE routineId = ${initialItem.routineId} AND itemOrder BETWEEN ${targetItemOrder} AND ${initialItemOrder};

        UPDATE routine_items
        SET itemOrder = ${targetItemOrder}
        WHERE id = ${initialItem.id};`,
        );
        setRoutineItems(
          data.map((item) => {
            if (item.id === initialItem.id) {
              return { ...item, itemOrder: targetItemOrder };
            }
            if (
              item.itemOrder >= targetItemOrder &&
              item.itemOrder <= initialItemOrder
            ) {
              return { ...item, itemOrder: item.itemOrder + 1 };
            }
            return item;
          }),
        );
      }
    },
    [routineItems, setRoutineItems, db],
  );
  const onRoutineSelect = async (id: number) => {
    await db.runAsync(
      `
        INSERT INTO routine_items (label, routineId, catId, effort)
        SELECT label, ${routine.id}, catId, effort FROM routine_items WHERE routineId = ${id}
      `,
    );
    setReloadDB(true);
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
    onRoutineSelect,
    updateRoutineItemOrder,
  };
};
