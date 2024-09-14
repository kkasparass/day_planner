import { SQLiteDatabase } from "expo-sqlite";

export const addCategoriesTableMigration = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        CREATE TABLE IF NOT EXISTS planning_categories (
          id INTEGER PRIMARY KEY NOT NULL,
          label TEXT NOT NULL,
          completed BOOLEAN DEFAULT 0 NOT NULL,
          parent INTEGER,
          FOREIGN KEY(parent) REFERENCES planning_categories(id)
        );
      `);
};
