import { SQLiteDatabase } from "expo-sqlite";

export const resetCompletedColumnMigration = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        ALTER TABLE planning_categories
        DROP COLUMN completed;
        ALTER TABLE planning_categories
        ADD COLUMN completed BOOLEAN DEFAULT 0 NOT NULL;
      `);
};
