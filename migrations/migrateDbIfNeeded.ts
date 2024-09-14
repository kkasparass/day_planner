import { SQLiteDatabase } from "expo-sqlite";
import { initialMigration } from "@/migrations/0_initial";
import { addCategoriesTableMigration } from "@/migrations/1_add_categories";
import { addTagColumnMigration } from "@/migrations/3_add_tag_column";
import { resetCompletedColumnMigration } from "./4_reset_completed_column";
import { lastDoneAndTodaoCategoryLinkMigration } from "./5_add_last_done_and_todao_link";

export const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
  const DATABASE_VERSION = 6;
  let { user_version: currentDbVersion } = (await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version")) as {
    user_version: number;
  };
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await initialMigration(db);
    currentDbVersion = 1;
  }
  if (currentDbVersion === 1) {
    await addCategoriesTableMigration(db);
    currentDbVersion = 2;
  }
  if (currentDbVersion === 2) {
    // Blank. I messed up
    currentDbVersion = 3;
  }
  if (currentDbVersion === 3) {
    await addTagColumnMigration(db);
    currentDbVersion = 4;
  }
  if (currentDbVersion === 4) {
    await resetCompletedColumnMigration(db);
    currentDbVersion = 5;
  }
  if (currentDbVersion === 5) {
    await lastDoneAndTodaoCategoryLinkMigration(db);
    currentDbVersion = 6;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};
