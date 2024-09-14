import { SQLiteDatabase } from "expo-sqlite";

export const lastDoneAndTodaoCategoryLinkMigration = async (
  db: SQLiteDatabase
) => {
  await db.execAsync(`
        ALTER TABLE planning_categories
        ADD COLUMN lastDone TEXT;
        ALTER TABLE daily_todos
        ADD COLUMN catId INTEGER;
        ALTER TABLE planning_categories
        ADD COLUMN parentLabel TEXT;
      `);
};
