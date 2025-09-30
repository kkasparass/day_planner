import { STATUS_COLORS } from "@/constants/Colors";
import { reloadTodao, todaoLoaded } from "@/store/slices/todaosSlice";
import { reloadTimeline as reloadTodaoTimeline } from "@/store/slices/todaoTimelineListSlice";
import { RootState } from "@/store/store";
import { DailyTodo, PlanningCategory, TodoTimelineItem } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useTimelineItem = ({
  timelineItem,
}: {
  timelineItem: TodoTimelineItem;
}) => {
  const { energyCap, id } = timelineItem;
  const reloadDB =
    useSelector((state: RootState) => state.todaos.queries)[id] ?? true;
  const dispatch = useDispatch();
  const db = useSQLiteContext();
  const [dayTodos, setDayTodods] = useState<DailyTodo[]>([]);
  const [todaoDialogVisible, setTodaoDialogVisible] = useState(false);
  const [enegryDialogVisible, setEnergyDialogVisible] = useState(false);

  const { totalTodosEffort, totalCompletedEffort } = useMemo(
    () =>
      dayTodos.reduce(
        (sum, todo) => {
          return {
            totalTodosEffort: sum.totalTodosEffort + todo.effort,
            totalCompletedEffort:
              sum.totalCompletedEffort + (todo.completed ? todo.effort : 0),
          };
        },
        { totalTodosEffort: 0, totalCompletedEffort: 0 }
      ),
    [dayTodos]
  );

  const dayProgressValue = useMemo(
    () =>
      totalCompletedEffort / energyCap < 1
        ? totalCompletedEffort / energyCap
        : 1,
    [totalCompletedEffort, energyCap]
  );

  const energyColor = useMemo(() => {
    if (totalTodosEffort > energyCap) {
      return STATUS_COLORS.alert;
    }
    if (totalTodosEffort === energyCap) {
      return STATUS_COLORS.warning;
    }
    return STATUS_COLORS.success;
  }, [totalTodosEffort, energyCap]);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<DailyTodo>(
        `SELECT * FROM daily_todos WHERE timelineId = ${id}
         ORDER BY
          id ASC;`
      );
      setDayTodods(result);
    }
    if (reloadDB) {
      setup();
      dispatch(todaoLoaded(id));
    }
  }, [reloadDB]);

  const reloadTimeline = useCallback(() => dispatch(reloadTodaoTimeline()), []);

  const handleDeleteDay = async () => {
    await db.runAsync("DELETE FROM todao_timeline WHERE id = $id", {
      $id: id,
    });
    reloadTimeline();
  };

  const onTextSubmit = async (label: string, cat?: PlanningCategory) => {
    await db.runAsync(
      "INSERT INTO daily_todos (label, timelineId, catId, effort) VALUES (?, ?, ?, ?)",
      label,
      id,
      cat?.id ? cat.id : null,
      cat?.effort || 0
    );
  };

  const onEnergyCapChange = async (newValue: string) => {
    await db.runAsync("UPDATE todao_timeline SET energyCap = ? WHERE id = ?", [
      newValue,
      id,
    ]);
    reloadTimeline();
  };

  const openEnergyDialog = () => setEnergyDialogVisible(true);
  const closeEnergyDialog = () => setEnergyDialogVisible(false);

  const openTodaoDialog = () => setTodaoDialogVisible(true);
  const closeTodaoDialog = () => setTodaoDialogVisible(false);

  const handleReloadDB = () => dispatch(reloadTodao(id));

  return {
    dayTodos,
    enegryDialogVisible,
    todaoDialogVisible,
    totalTodosEffort,
    dayProgressValue,
    energyColor,
    openEnergyDialog,
    closeEnergyDialog,
    openTodaoDialog,
    closeTodaoDialog,
    handleDeleteDay,
    onTextSubmit,
    onEnergyCapChange,
    handleReloadDB,
  };
};
