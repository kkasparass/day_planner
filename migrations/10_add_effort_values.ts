import { SQLiteDatabase } from "expo-sqlite";

export const addEffortValuesMigration = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        ALTER TABLE planning_categories
        ADD COLUMN effort INTEGER DEFAULT 0 NOT NULL;
        ALTER TABLE daily_todos
        ADD COLUMN effort INTEGER DEFAULT 0 NOT NULL;
        ALTER TABLE todao_timeline
        ADD COLUMN energyCap INTEGER DEFAULT 0 NOT NULL;
        ALTER TABLE routine_items
        ADD COLUMN effort INTEGER DEFAULT 0 NOT NULL;
      `);
};
