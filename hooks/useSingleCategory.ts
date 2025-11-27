import { PlanningCategory } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

export const useSingleCategory = ({ id }: { id: number }) => {
  const db = useSQLiteContext();
  const [shouldReloadDB, setShouldReloadDB] = useState(true);
  const [category, setCategory] = useState<PlanningCategory | null>(null);

  useEffect(() => {
    async function setup() {
      const result = await db.getFirstAsync<PlanningCategory>(
        `SELECT * FROM planning_categories WHERE id=${id}`
      );
      setCategory(result);
    }
    if (shouldReloadDB) {
      setup();
      setShouldReloadDB(false);
    }
  }, [shouldReloadDB]);

  const editTag = async (tag: string) => {
    await db.runAsync("UPDATE planning_categories SET tag = ? WHERE id = ?", [
      tag,
      `${id}`,
    ]);
    setShouldReloadDB(true);
  };

  const reloadDB = () => setShouldReloadDB(true);

  return {
    category,
    editTag,
    reloadDB,
  };
};
