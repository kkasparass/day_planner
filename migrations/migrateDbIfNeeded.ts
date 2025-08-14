import { SQLiteDatabase } from "expo-sqlite";
import { initialMigration } from "@/migrations/0_initial";
import { addCategoriesTableMigration } from "@/migrations/1_add_categories";
import { addTagColumnMigration } from "@/migrations/3_add_tag_column";
import { resetCompletedColumnMigration } from "./4_reset_completed_column";
import { lastDoneAndTodaoCategoryLinkMigration } from "./5_add_last_done_and_todao_link";
import { addRepeatFreqColumnMigration } from "./6_add_repeat_freq_to_cat";
import { reapeatFreqSetValueMigration } from "./7_reapeat_freq_set_value";
import { createRoutinesTableMigration } from "./8_routines_table";
import { createRoutineItemsTableMigration } from "./9_add_routine_items_table";
import { addEffortValuesMigration } from "./10_add_effort_values";

export const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
  const DATABASE_VERSION = 11;
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
  if (currentDbVersion === 6) {
    await addRepeatFreqColumnMigration(db);
    currentDbVersion = 7;
  }
  if (currentDbVersion === 7) {
    await reapeatFreqSetValueMigration(db);
    currentDbVersion = 8;
  }
  if (currentDbVersion === 8) {
    await createRoutinesTableMigration(db);
    currentDbVersion = 9;
  }
  if (currentDbVersion === 9) {
    await createRoutineItemsTableMigration(db);
    currentDbVersion = 10;
  }
  if (currentDbVersion === 10) {
    await addEffortValuesMigration(db);
    currentDbVersion = 11;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};
