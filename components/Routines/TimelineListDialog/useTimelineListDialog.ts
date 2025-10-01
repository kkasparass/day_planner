import { TodoTimeline, TodoTimelineItem } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

export const useTimelineListDialog = ({
  isVisible,
}: {
  isVisible: boolean;
}) => {
  const db = useSQLiteContext();
  const [todaoTimeline, setTodaoTimeline] = useState<TodoTimeline>();
  const [reloadDB, setReloadDB] = useState(true);

  useEffect(() => {
    if (isVisible) {
      setReloadDB(true);
    }
  }, [isVisible]);

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

  return {
    todaoTimeline,
  };
};
