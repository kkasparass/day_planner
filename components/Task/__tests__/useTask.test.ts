import { renderHook, act } from "@testing-library/react-native";
import { useSQLiteContext } from "expo-sqlite";
import { createMockDb } from "@/__mocks__/createMockDb";
import { useTask } from "../useTask";
import { DailyTodo } from "@/types/types";

const mockDb = createMockDb();

beforeEach(() => {
  jest.clearAllMocks();
  (useSQLiteContext as jest.Mock).mockReturnValue(mockDb);
});

const todo: DailyTodo = {
  id: 5,
  label: "Run",
  completed: false,
  timelineId: 1,
  catId: 0,
  effort: 3,
  itemOrder: 1,
};

const makeHook = (overrides: Partial<DailyTodo> = {}, reloadTodos = jest.fn()) =>
  renderHook(() =>
    useTask({ todo: { ...todo, ...overrides }, dayDate: "2026-03-19", reloadTodos })
  );

describe("useTask", () => {
  it("editDialogVisible starts as false", () => {
    const { result } = makeHook();
    expect(result.current.editDialogVisible).toBe(false);
  });

  it("openEditDialog and closeEditDialog toggle visibility", () => {
    const { result } = makeHook();
    act(() => result.current.openEditDialog());
    expect(result.current.editDialogVisible).toBe(true);
    act(() => result.current.closeEditDialog());
    expect(result.current.editDialogVisible).toBe(false);
  });

  it("handleUpdateChecked updates completed and calls reloadTodos", async () => {
    const reloadTodos = jest.fn();
    mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 0, changes: 1 });
    const { result } = makeHook({}, reloadTodos);

    await act(async () => {
      await result.current.handleUpdateChecked();
    });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE daily_todos SET completed"),
      [true, 5]
    );
    expect(reloadTodos).toHaveBeenCalledTimes(1);
  });

  it("handleUpdateChecked also updates lastDone when catId is set", async () => {
    const reloadTodos = jest.fn();
    mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 0, changes: 1 });
    const { result } = makeHook({ catId: 99 }, reloadTodos);

    await act(async () => {
      await result.current.handleUpdateChecked();
    });

    expect(mockDb.runAsync).toHaveBeenCalledTimes(2);
    expect(mockDb.runAsync).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("UPDATE planning_categories SET lastDone"),
      ["2026-03-19", 99]
    );
  });

  it("handleDelete removes the todo and calls reloadTodos", async () => {
    const reloadTodos = jest.fn();
    mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 0, changes: 1 });
    const { result } = makeHook({}, reloadTodos);

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM daily_todos"),
      { $id: 5 }
    );
    expect(reloadTodos).toHaveBeenCalledTimes(1);
  });

  it("handleEditTask updates label and effort then calls reloadTodos", async () => {
    const reloadTodos = jest.fn();
    mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 0, changes: 1 });
    const { result } = makeHook({}, reloadTodos);

    await act(async () => {
      await result.current.handleEditTask("Swim", 5);
    });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE daily_todos SET label"),
      ["Swim", 5, 5]
    );
    expect(reloadTodos).toHaveBeenCalledTimes(1);
  });
});
