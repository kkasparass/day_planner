import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useSQLiteContext } from "expo-sqlite";
import { createMockDb } from "@/__mocks__/createMockDb";
import { useTodaoTimeline } from "../useTodaoTimeline";
import counterReducer from "@/store/slices/todaoTimelineListSlice";
import todaosReducer from "@/store/slices/todaosSlice";

const mockDb = createMockDb();

const makeStore = (reloadDB = true) =>
  configureStore({
    reducer: { counter: counterReducer, todaos: todaosReducer },
    preloadedState: {
      counter: { reloadDB },
      todaos: { queries: {} },
    },
  });

const makeWrapper =
  (store: ReturnType<typeof makeStore>) =>
  ({ children }: { children: React.ReactNode }) =>
    React.createElement(Provider, { store }, children);

beforeEach(() => {
  jest.clearAllMocks();
  (useSQLiteContext as jest.Mock).mockReturnValue(mockDb);
});

describe("useTodaoTimeline", () => {
  it("fetches timeline on mount when reloadDB is true", async () => {
    const mockTimeline = [{ id: 1, date: "2026-03-19", energyCap: 10 }];
    mockDb.getAllAsync.mockResolvedValue(mockTimeline);
    const store = makeStore(true);

    const { result } = renderHook(() => useTodaoTimeline(), {
      wrapper: makeWrapper(store),
    });

    await waitFor(() => {
      expect(result.current.todaoTimeline).toEqual(mockTimeline);
    });
    expect(store.getState().counter.reloadDB).toBe(false);
  });

  it("does not fetch when reloadDB is false", async () => {
    const store = makeStore(false);
    renderHook(() => useTodaoTimeline(), { wrapper: makeWrapper(store) });

    await act(async () => {});
    expect(mockDb.getAllAsync).not.toHaveBeenCalled();
  });

  it("handleNewDay inserts a row into todao_timeline", async () => {
    mockDb.getAllAsync.mockResolvedValue([]);
    mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 1, changes: 1 });
    const store = makeStore(true);

    const { result } = renderHook(() => useTodaoTimeline(), {
      wrapper: makeWrapper(store),
    });

    await waitFor(() => expect(store.getState().counter.reloadDB).toBe(false));

    await act(async () => {
      await result.current.handleNewDay();
    });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO todao_timeline")
    );
  });
});
