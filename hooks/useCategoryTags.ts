import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

export const useCategoryTags = () => {
  const db = useSQLiteContext();
  const [tags, setTags] = useState<(string | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<{ tag: string | null }>(
        `SELECT tag FROM planning_categories GROUP BY tag;`
      );
      setTags(result.map(({ tag }) => tag));
    }
    setup();
  }, []);

  return { tags, selectedIndex, setSelectedIndex };
};
