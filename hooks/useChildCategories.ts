import { PlanningCategories, PlanningCategory } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

export const useChildCategories = ({
  parent,
  reloadParent = () => {},
  showCompleted,
}: {
  parent: PlanningCategory;
  reloadParent?: () => void;
  showCompleted?: boolean;
}) => {
  const [selected, setselected] = useState(true);
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<PlanningCategories>([]);
  const [reloadDB, setReloadDB] = useState(true);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<PlanningCategory>(
        `SELECT * FROM planning_categories WHERE parent = ${parent.id} ${
          showCompleted ? "" : "AND completed=0"
        }`
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

  const addChildCategory = async (label: string, effort: number) => {
    const res = await db.runAsync(
      "INSERT INTO planning_categories (label, parent, parentLabel, repeatFreq, effort) VALUES (?, ?, ?, ?, ?)",
      label,
      parent.id,
      parent.label,
      0,
      effort
    );
    triggerReloadDB();
  };

  const deleteCategory = async () => {
    await db.runAsync("DELETE FROM planning_categories WHERE id = $id", {
      $id: parent.id,
    });
    reloadParent();
  };

  return {
    selected,
    categories,
    hasChidlren,
    toggle,
    triggerReloadDB,
    addChildCategory,
    deleteCategory,
  };
};
