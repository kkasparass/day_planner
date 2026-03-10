import { useSQLiteContext } from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { useEffect, useState } from "react";
import { UserSettings } from "@/types/types";

export const useSettingsPage = () => {
  const db = useSQLiteContext();
  const [userSettings, setUserSettings] = useState<UserSettings>();
  const [reloadUserSettings, setReloadReloadUserSettings] = useState(true);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<UserSettings>(
        `SELECT * FROM user_settings`,
      );
      setUserSettings(result[0]);
    }
    if (reloadUserSettings) {
      setup();
      setReloadReloadUserSettings(false);
    }
  }, [reloadUserSettings]);

  const updateInitialEffort = async (newEffort: string) => {
    await db.execAsync(`
      UPDATE user_settings
      SET initialEffort = ${newEffort}
    `);
    setReloadReloadUserSettings(true);
  };

  const backupDatabase = async (backupName: string) => {
    try {
      await db.execAsync("PRAGMA wal_checkpoint(FULL)");
      const appPath = FileSystem.documentDirectory;
      const dbPath = `${appPath}/SQLite/${db.databaseName}`;
      const backupPath = `${appPath}/SQLite/${backupName}`;
      await FileSystem.copyAsync({
        from: dbPath,
        to: backupPath,
      });
      await Sharing.shareAsync(backupPath, {
        mimeType: "application/x-sqlite3",
      });
    } catch (error) {
      alert(error);
    }
  };

  const restoreDatabase = async () => {
    try {
      const appPath = FileSystem.documentDirectory;
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled) {
        return;
      }
      const backupPath = result.assets[0].uri;
      if (!(await FileSystem.getInfoAsync(backupPath)).exists) {
        return;
      }
      await db.execAsync("PRAGMA wal_checkpoint(FULL)");
      await db.closeAsync();
      const dbPath = `${appPath}/SQLite/${db.databaseName}`;
      await FileSystem.deleteAsync(`${dbPath}-wal`, { idempotent: true });
      await FileSystem.deleteAsync(`${dbPath}-shm`, { idempotent: true });

      await FileSystem.copyAsync({
        to: dbPath,
        from: backupPath,
      });
    } catch (error) {
      alert(error);
    }
  };

  const deleteAllData = async () => {
    await db.execAsync(`
      DELETE FROM todao_timeline;
      Delete FROM daily_todos;
      Delete FROM planning_categories;
    `);
  };
  const deleteTimeline = async () => {
    await db.execAsync(`
      DELETE FROM todao_timeline;
    `);
  };
  const deleteTodos = async () => {
    await db.execAsync(`
      DELETE FROM daily_todos;
    `);
  };
  const deleteCategories = async () => {
    await db.execAsync(`
      DELETE FROM planning_categories;
    `);
  };

  const runCustomDBCommand = async () => {
    // await db.execAsync(`DROP TABLE user_settings`);
    // await db.execAsync(`PRAGMA user_version = 11`);
  };

  return {
    userSettings,
    runCustomDBCommand,
    updateInitialEffort,
    backupDatabase,
    restoreDatabase,
    deleteAllData,
    deleteTimeline,
    deleteTodos,
    deleteCategories,
  };
};
