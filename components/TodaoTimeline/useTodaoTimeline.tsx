import {
  reloadTimeline,
  timelineLoaded,
} from "@/store/slices/todaoTimelineListSlice";
import { RootState } from "@/store/store";
import { TodoTimeline, TodoTimelineItem } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useTodaoTimeline = () => {
  const reloadDB = useSelector((state: RootState) => state.counter.reloadDB);
  const dispatch = useDispatch();
  const db = useSQLiteContext();
  const [todaoTimeline, setTodaoTimeline] = useState<TodoTimeline>();
  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<TodoTimelineItem>(
        "SELECT * FROM todao_timeline ORDER BY id DESC LIMIT 14"
      );
      setTodaoTimeline(result);
    }
    if (reloadDB) {
      setup();
      dispatch(timelineLoaded());
    }
  }, [reloadDB]);

  const handleNewDay = async () => {
    await db.runAsync(
      "INSERT INTO todao_timeline (date, energyCap) VALUES (?, ?)",
      `${new Date()}`,
      16
    );
    dispatch(reloadTimeline());
  };

  return { todaoTimeline, handleNewDay };
};
