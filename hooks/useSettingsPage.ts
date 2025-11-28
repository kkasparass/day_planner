import { useSQLiteContext } from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

export const useSettingsPage = () => {
  const db = useSQLiteContext();

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

  return {
    backupDatabase,
    restoreDatabase,
    deleteAllData,
    deleteTimeline,
    deleteTodos,
    deleteCategories,
  };
};
