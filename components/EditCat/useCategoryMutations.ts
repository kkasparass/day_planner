import { useSQLiteContext } from "expo-sqlite";
import { PlanningCategory } from "@/types/types";

export const useCategoryMutations = ({
  category,
  reloadParent,
}: {
  category: PlanningCategory;
  reloadParent: () => void;
}) => {
  const db = useSQLiteContext();

  const updateChecked = async () => {
    await db.runAsync(
      "UPDATE planning_categories SET completed = ? WHERE id = ?",
      [!category.completed, category.id]
    );
    reloadParent();
  };

  const updateRepeatFreq = async (input: number) => {
    await db.runAsync(
      "UPDATE planning_categories SET repeatFreq = ? WHERE id = ?",
      [input, category.id]
    );
  };

  const editLabel = async (label: string, effort: number) => {
    await db.runAsync(
      "UPDATE planning_categories SET label = ?, effort = ? WHERE id = ?",
      [label, effort, category.id]
    );
    reloadParent();
  };

  return {
    updateChecked,
    updateRepeatFreq,
    editLabel,
  };
};
