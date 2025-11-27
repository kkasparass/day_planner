import { PlanningCategories, PlanningCategory } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

export const useParentCategories = ({ tag }: { tag?: string | null }) => {
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<PlanningCategories>([]);
  const [reloadDB, setReloadDB] = useState(true);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<PlanningCategory>(
        `SELECT * FROM planning_categories WHERE parent IS NULL AND ${
          tag === null ? "tag is NULL" : `tag="${tag}" AND completed=0`
        }`
      );
      setCategories(result);
    }
    if (reloadDB) {
      setup();
      setReloadDB(false);
    }
  }, [reloadDB]);

  return { categories };
};
