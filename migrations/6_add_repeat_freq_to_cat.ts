import { SQLiteDatabase } from "expo-sqlite";

export const addRepeatFreqColumnMigration = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        ALTER TABLE planning_categories
        ADD COLUMN reapeatFreq INTEGER;
      `);
};
