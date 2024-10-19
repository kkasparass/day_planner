import { SQLiteDatabase } from "expo-sqlite";

export const createRoutinesTableMigration = async (db: SQLiteDatabase) => {
  await db.execAsync(`
      CREATE TABLE IF NOT EXISTS routines (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL);
    `);
};
