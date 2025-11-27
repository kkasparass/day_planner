import { PlanningCategories, PlanningCategory } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

export const useChildCategories = ({
  parent,
}: {
  parent: PlanningCategory;
}) => {
  const [selected, setselected] = useState(true);
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<PlanningCategories>([]);
  const [reloadDB, setReloadDB] = useState(true);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<PlanningCategory>(
        `SELECT * FROM planning_categories WHERE parent = ${parent.id} AND completed=0`
      );
      setCategories(result);
    }
    if (reloadDB) {
      setup();
      setReloadDB(false);
    }
  }, [reloadDB]);

  const toggle = () => {
    setselected((value) => !value);
  };

  const triggerReloadDB = () => setReloadDB(true);

  const hasChidlren = categories.length > 0;

  return { selected, categories, hasChidlren, toggle, triggerReloadDB };
};
