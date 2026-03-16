import { SQLiteDatabase } from "expo-sqlite";

export const addUserSettingsMigration = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        CREATE TABLE IF NOT EXISTS user_settings (
          id INTEGER PRIMARY KEY NOT NULL,
          initialEffort INTEGER DEFAULT 24 NOT NULL
        );
        INSERT INTO user_settings (initialEffort) VALUES (24);
      `);
};
