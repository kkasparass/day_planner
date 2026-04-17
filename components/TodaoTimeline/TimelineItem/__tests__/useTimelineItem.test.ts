import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useSQLiteContext } from "expo-sqlite";
import { createMockDb } from "@/__mocks__/createMockDb";
import { useTimelineItem } from "../useTimelineItem";
import counterReducer from "@/store/slices/todaoTimelineListSlice";
import todaosReducer from "@/store/slices/todaosSlice";
import { STATUS_COLORS } from "@/constants/Colors";
import { DailyTodo, TodoTimelineItem } from "@/types/types";

const mockDb = createMockDb();

const timelineItem: TodoTimelineItem = {
  id: 5,
  date: "2026-03-19",
  energyCap: 10,
};

const makeStore = (reloadForId: number | null = null) =>
  configureStore({
    reducer: { counter: counterReducer, todaos: todaosReducer },
    preloadedState: {
      counter: { reloadDB: false },
      todaos: {
        queries: reloadForId !== null ? { [reloadForId]: true } : {},
      },
    },
  });

const makeWrapper = (store: ReturnType<typeof makeStore>) => {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(Provider, { store, children });
  }
  return Wrapper;
};

const makeTodo = (overrides: Partial<DailyTodo> = {}): DailyTodo => ({
  id: 1,
  label: "Task",
  completed: false,
  timelineId: 5,
  catId: 0,
  effort: 3,
  itemOrder: 1,
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  (useSQLiteContext as jest.Mock).mockReturnValue(mockDb);
});

describe("useTimelineItem", () => {
  it("fetches todos and splits into undone/completed", async () => {
    mockDb.getAllAsync.mockResolvedValue([
      makeTodo({ id: 1, completed: false }),
      makeTodo({ id: 2, completed: true }),
    ]);
    const store = makeStore(5);

    const { result } = renderHook(
      () => useTimelineItem({ timelineItem }),
      { wrapper: makeWrapper(store) }
    );
    await act(async () => {});

    expect(result.current.undoneTodos).toHaveLength(1);
    expect(result.current.completedTodos).toHaveLength(1);
    expect(store.getState().todaos.queries[5]).toBe(false);
  });

  it("computes totalTodosEffort correctly", async () => {
    mockDb.getAllAsync.mockResolvedValue([
      makeTodo({ effort: 4 }),
      makeTodo({ id: 2, effort: 3 }),
    ]);
    const store = makeStore(5);

    const { result } = renderHook(
      () => useTimelineItem({ timelineItem }),
      { wrapper: makeWrapper(store) }
    );
    await act(async () => {});

    expect(result.current.totalTodosEffort).toBe(7);
  });

  it("energyColor is alert when totalTodosEffort exceeds energyCap", async () => {
    mockDb.getAllAsync.mockResolvedValue([makeTodo({ effort: 11 })]);
    const store = makeStore(5);

    const { result } = renderHook(
      () => useTimelineItem({ timelineItem }),
      { wrapper: makeWrapper(store) }
    );
    await act(async () => {});

    expect(result.current.energyColor).toBe(STATUS_COLORS.alert);
  });

  it("energyColor is warning when totalTodosEffort equals energyCap", async () => {
    mockDb.getAllAsync.mockResolvedValue([makeTodo({ effort: 10 })]);
    const store = makeStore(5);

    const { result } = renderHook(
      () => useTimelineItem({ timelineItem }),
      { wrapper: makeWrapper(store) }
    );
    await act(async () => {});

    expect(result.current.energyColor).toBe(STATUS_COLORS.warning);
  });

  it("energyColor is success when under energyCap", async () => {
    mockDb.getAllAsync.mockResolvedValue([makeTodo({ effort: 5 })]);
    const store = makeStore(5);

    const { result } = renderHook(
      () => useTimelineItem({ timelineItem }),
      { wrapper: makeWrapper(store) }
    );
    await act(async () => {});

    expect(result.current.energyColor).toBe(STATUS_COLORS.success);
  });

  it("onTextSubmit inserts a todo with correct arguments", async () => {
    mockDb.getAllAsync.mockResolvedValue([]);
    mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 1, changes: 1 });
    const store = makeStore(5);

    const { result } = renderHook(
      () => useTimelineItem({ timelineItem }),
      { wrapper: makeWrapper(store) }
    );
    await act(async () => {});

    await act(async () => {
      await result.current.onTextSubmit("New task");
    });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO daily_todos"),
      "New task",
      5,
      null,
      0
    );
  });

  it("dialog open/close state toggles correctly", async () => {
    mockDb.getAllAsync.mockResolvedValue([]);
    const store = makeStore(null);

    const { result } = renderHook(
      () => useTimelineItem({ timelineItem }),
      { wrapper: makeWrapper(store) }
    );
    await act(async () => {});

    expect(result.current.todaoDialogVisible).toBe(false);
    act(() => result.current.openTodaoDialog());
    expect(result.current.todaoDialogVisible).toBe(true);
    act(() => result.current.closeTodaoDialog());
    expect(result.current.todaoDialogVisible).toBe(false);
  });

  it("handleDeleteDay calls runAsync and dispatches reloadTimeline", async () => {
    mockDb.getAllAsync.mockResolvedValue([]);
    mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 0, changes: 1 });
    const store = makeStore(null);

    const { result } = renderHook(
      () => useTimelineItem({ timelineItem }),
      { wrapper: makeWrapper(store) }
    );
    await act(async () => {});

    await act(async () => {
      await result.current.handleDeleteDay();
    });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM todao_timeline"),
      { $id: 5 }
    );
    expect(store.getState().counter.reloadDB).toBe(true);
  });
});
