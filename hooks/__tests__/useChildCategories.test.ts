import { renderHook, waitFor, act } from "@testing-library/react-native";
import { useSQLiteContext } from "expo-sqlite";
import { createMockDb } from "@/__mocks__/createMockDb";
import { useChildCategories } from "../useChildCategories";
import { PlanningCategory } from "@/types/types";

const mockDb = createMockDb();

beforeEach(() => {
  jest.clearAllMocks();
  (useSQLiteContext as jest.Mock).mockReturnValue(mockDb);
});

const parentCategory: PlanningCategory = {
  id: 10,
  label: "Fitness",
  completed: false,
  parnet: 0,
  tag: "Health",
  parentLabel: "",
  lastDone: null,
  repeatFreq: 0,
  effort: 0,
};

const childCategory: PlanningCategory = {
  id: 11,
  label: "Run 5k",
  completed: false,
  parnet: 10,
  tag: "Health",
  parentLabel: "Fitness",
  lastDone: null,
  repeatFreq: 7,
  effort: 3,
};

describe("useChildCategories", () => {
  it("fetches child categories on mount", async () => {
    mockDb.getAllAsync.mockResolvedValue([childCategory]);

    const { result } = renderHook(() =>
      useChildCategories({ parent: parentCategory })
    );
    await act(async () => {});

    expect(result.current.categories).toEqual([childCategory]);
    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("WHERE parent = 10")
    );
  });

  it("starts selected as true", async () => {
    mockDb.getAllAsync.mockResolvedValue([]);

    const { result } = renderHook(() =>
      useChildCategories({ parent: parentCategory })
    );
    await act(async () => {});

    expect(result.current.selected).toBe(true);
  });

  it("toggle flips the selected state", async () => {
    mockDb.getAllAsync.mockResolvedValue([]);

    const { result } = renderHook(() =>
      useChildCategories({ parent: parentCategory })
    );
    await act(async () => {});

    act(() => result.current.toggle());
    expect(result.current.selected).toBe(false);

    act(() => result.current.toggle());
    expect(result.current.selected).toBe(true);
  });

  it("hasChidlren is true when categories exist", async () => {
    mockDb.getAllAsync.mockResolvedValue([childCategory]);

    const { result } = renderHook(() =>
      useChildCategories({ parent: parentCategory })
    );
    await act(async () => {});

    expect(result.current.hasChidlren).toBe(true);
  });

  it("addChildCategory inserts a row and triggers reload", async () => {
    mockDb.getAllAsync.mockResolvedValue([]);
    mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 1, changes: 1 });

    const { result } = renderHook(() =>
      useChildCategories({ parent: parentCategory })
    );
    await act(async () => {});

    await act(async () => {
      await result.current.addChildCategory("Run 5k", 3);
    });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO planning_categories"),
      "Run 5k",
      10,
      "Fitness",
      0,
      3
    );
  });

  it("deleteCategory calls runAsync and reloadParent", async () => {
    const reloadParent = jest.fn();
    mockDb.getAllAsync.mockResolvedValue([]);
    mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 0, changes: 1 });

    const { result } = renderHook(() =>
      useChildCategories({ parent: parentCategory, reloadParent })
    );
    await act(async () => {});

    await act(async () => {
      await result.current.deleteCategory();
    });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM planning_categories"),
      { $id: 10 }
    );
    expect(reloadParent).toHaveBeenCalledTimes(1);
  });
});
