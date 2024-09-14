import { SQLiteDatabase } from "expo-sqlite";

export const addTagColumnMigration = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        ALTER TABLE planning_categories
        ADD COLUMN tag TEXT
      `);
};
