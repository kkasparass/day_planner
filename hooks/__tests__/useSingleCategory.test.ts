import { renderHook, waitFor, act } from "@testing-library/react-native";
import { useSQLiteContext } from "expo-sqlite";
import { createMockDb } from "@/__mocks__/createMockDb";
import { useSingleCategory } from "../useSingleCategory";
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
  lastDone: "2026-03-10",
  repeatFreq: 7,
  effort: 3,
};

describe("useSingleCategory", () => {
  it("fetches the category by id on mount", async () => {
    mockDb.getFirstAsync.mockResolvedValue(mockCategory);

    const { result } = renderHook(() => useSingleCategory({ id: 1 }));
    await act(async () => {});

    expect(result.current.category).toEqual(mockCategory);
    expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
      expect.stringContaining("WHERE id=1")
    );
  });

  it("starts with category as null", async () => {
    mockDb.getFirstAsync.mockResolvedValue(null);

    const { result } = renderHook(() => useSingleCategory({ id: 1 }));
    await act(async () => {});

    expect(result.current.category).toBeNull();
  });

  it("editTag calls runAsync with the new tag and triggers a refetch", async () => {
    mockDb.getFirstAsync
      .mockResolvedValueOnce(mockCategory)
      .mockResolvedValueOnce({ ...mockCategory, tag: "Fitness" });
    mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 0, changes: 1 });

    const { result } = renderHook(() => useSingleCategory({ id: 1 }));
    await act(async () => {});

    await act(async () => {
      await result.current.editTag("Fitness");
    });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE planning_categories SET tag"),
      ["Fitness", "1"]
    );
    await waitFor(() =>
      expect(result.current.category?.tag).toBe("Fitness")
    );
  });

  it("reloadDB triggers a re-fetch", async () => {
    mockDb.getFirstAsync.mockResolvedValue(mockCategory);

    const { result } = renderHook(() => useSingleCategory({ id: 1 }));
    await act(async () => {});

    expect(mockDb.getFirstAsync).toHaveBeenCalledTimes(1);

    act(() => result.current.reloadDB());
    await act(async () => {});

    expect(mockDb.getFirstAsync).toHaveBeenCalledTimes(2);
  });
});
