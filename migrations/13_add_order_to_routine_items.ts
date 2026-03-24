import { SQLiteDatabase } from "expo-sqlite";

export const addOrderToRoutineItems = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        ALTER TABLE routine_items ADD COLUMN itemOrder INTEGER DEFAULT 0;
        UPDATE routine_items
          SET itemOrder = (
              SELECT COALESCE(MAX(itemOrder), 0) + 1
              FROM routine_items AS ri2
              WHERE ri2.routineId = routine_items.routineId
          )
          WHERE id IN (
              SELECT id
              FROM routine_items AS ri3
              WHERE ri3.routineId = routine_items.routineId
          );

          CREATE TRIGGER set_routine_item_order_value
          AFTER INSERT ON routine_items
          FOR EACH ROW
          WHEN NEW.itemOrder IS 0
          BEGIN
            UPDATE routine_items
            SET itemOrder = (
              SELECT COALESCE(MAX(itemOrder), 0) + 1
              FROM routine_items
              WHERE routineId = NEW.routineId
                AND id != NEW.id
            )
            WHERE id = NEW.id;
          END;
      `);
};
