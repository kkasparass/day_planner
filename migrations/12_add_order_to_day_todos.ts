import { SQLiteDatabase } from "expo-sqlite";

export const addOrderToDayTodos = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        ALTER TABLE daily_todos ADD COLUMN itemOrder INTEGER DEFAULT 0;
        UPDATE daily_todos
          SET itemOrder = (
              SELECT COALESCE(MAX(itemOrder), 0) + 1
              FROM daily_todos AS dt2
              WHERE dt2.timelineId = daily_todos.timelineId
          )
          WHERE id IN (
              SELECT id
              FROM daily_todos AS dt3
              WHERE dt3.timelineId = daily_todos.timelineId
          );

          CREATE TRIGGER set_order_value
          AFTER INSERT ON daily_todos
          FOR EACH ROW
          WHEN NEW.itemOrder IS 0
          BEGIN
            UPDATE daily_todos
            SET itemOrder = (
              SELECT COALESCE(MAX(itemOrder), 0) + 1
              FROM daily_todos
              WHERE timelineId = NEW.timelineId
                AND id != NEW.id
            )
            WHERE id = NEW.id;
          END;
      `);
};
