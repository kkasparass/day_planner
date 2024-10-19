import { SQLiteDatabase } from "expo-sqlite";

export const createRoutineItemsTableMigration = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS routine_items (
      id INTEGER PRIMARY KEY NOT NULL,
      label TEXT NOT NULL,
      catId INTEGER,
      routineId INTEGER,
      FOREIGN KEY(routineId) REFERENCES routines(id)
    );
  `);
};
