import { SQLiteDatabase } from "expo-sqlite";

export const initialMigration = async (db: SQLiteDatabase) => {
  await db.execAsync("PRAGMA journal_mode = WAL");
  await db.execAsync("PRAGMA foreign_keys = ON");
  await db.execAsync(`
      CREATE TABLE IF NOT EXISTS todao_timeline (id INTEGER PRIMARY KEY NOT NULL, date TEXT NOT NULL);
    `);
  await db.execAsync(`
      CREATE TABLE IF NOT EXISTS daily_todos (
        id INTEGER PRIMARY KEY NOT NULL,
        label TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0 NOT NULL,
        timelineId INTEGER,
        FOREIGN KEY(timelineId) REFERENCES todao_timeline(id)
      );
    `);
};
