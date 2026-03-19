import { renderHook, waitFor, act } from "@testing-library/react-native";
import { useSQLiteContext } from "expo-sqlite";
import { createMockDb } from "@/__mocks__/createMockDb";
import { useParentCategories } from "../useParentCategories";
import { PlanningCategory } from "@/types/types";

const mockDb = createMockDb();

beforeEach(() => {
  jest.clearAllMocks();
  (useSQLiteContext as jest.Mock).mockReturnValue(mockDb);
});

const mockCategory: PlanningCategory = {
  id: 1,
  label: "Exercise",
  completed: false,
  parnet: 0,
  tag: "Health",
  parentLabel: "",
  lastDone: null,
  repeatFreq: 7,
  effort: 3,
};

describe("useParentCategories", () => {
  it("fetches categories by tag on mount", async () => {
    mockDb.getAllAsync.mockResolvedValue([mockCategory]);

    const { result } = renderHook(() => useParentCategories({ tag: "Health" }));
    await act(async () => {});

    expect(result.current.categories).toEqual([mockCategory]);
    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining('tag="Health"')
    );
  });

  it("starts with empty categories array", async () => {
    mockDb.getAllAsync.mockResolvedValue([]);

    const { result } = renderHook(() => useParentCategories({ tag: "Health" }));
    await act(async () => {});

    expect(result.current.categories).toEqual([]);
  });

  it("addParentCaregory inserts a row and triggers reload", async () => {
    mockDb.getAllAsync
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([mockCategory]);
    mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 1, changes: 1 });

    const { result } = renderHook(() => useParentCategories({ tag: "Health" }));
    await act(async () => {});

    await act(async () => {
      await result.current.addParentCaregory("Exercise", 3);
    });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO planning_categories"),
      "Exercise",
      "Health",
      0,
      3
    );
    await waitFor(() => expect(result.current.categories).toEqual([mockCategory]));
  });

  it("refreshDB triggers a re-fetch", async () => {
    mockDb.getAllAsync.mockResolvedValue([]);

    const { result } = renderHook(() => useParentCategories({ tag: "Health" }));
    await act(async () => {});

    expect(mockDb.getAllAsync).toHaveBeenCalledTimes(1);

    act(() => result.current.refreshDB());
    await act(async () => {});

    expect(mockDb.getAllAsync).toHaveBeenCalledTimes(2);
  });
});
