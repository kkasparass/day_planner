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

  const addParentCaregory = async (label: string, effort: number) => {
    await db.runAsync(
      "INSERT INTO planning_categories (label, tag, repeatFreq, effort) VALUES (?, ?, ?, ?)",
      label,
      tag ?? null,
      0,
      effort
    );
    setReloadDB(true);
  };

  const refreshDB = () => setReloadDB(true);

  return { categories, addParentCaregory, refreshDB };
};
