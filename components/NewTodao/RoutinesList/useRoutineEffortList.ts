import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { RoutineEffortEntry } from "./types";

export const useRoutineEffortList = () => {
  const db = useSQLiteContext();
  const [routines, setRoutines] = useState<RoutineEffortEntry[]>();

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<RoutineEffortEntry>(
        `SELECT 
            r.id,
            r.title,
            COALESCE(SUM(ri.effort), 0) AS totalEffort
        FROM 
            routines r
        LEFT JOIN 
            routine_items ri ON r.id = ri.routineId
        GROUP BY 
            r.id;
        `,
      );
      setRoutines(result);
    }
    setup();
  }, [db]);

  return {
    routines,
  };
};
