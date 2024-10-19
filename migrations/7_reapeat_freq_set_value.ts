import { SQLiteDatabase } from "expo-sqlite";

export const reapeatFreqSetValueMigration = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        ALTER TABLE planning_categories
        DROP COLUMN reapeatFreq;
        ALTER TABLE planning_categories
        ADD COLUMN repeatFreq BOOLEAN DEFAULT 0 NOT NULL;
      `);
};
