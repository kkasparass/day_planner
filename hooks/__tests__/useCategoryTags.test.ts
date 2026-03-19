import { renderHook, waitFor, act } from "@testing-library/react-native";
import { useSQLiteContext } from "expo-sqlite";
import { createMockDb } from "@/__mocks__/createMockDb";
import { useCategoryTags } from "../useCategoryTags";

const mockDb = createMockDb();

beforeEach(() => {
  jest.clearAllMocks();
  (useSQLiteContext as jest.Mock).mockReturnValue(mockDb);
});

describe("useCategoryTags", () => {
  it("fetches tags on mount and stores them in state", async () => {
    mockDb.getAllAsync.mockResolvedValue([{ tag: "Health" }, { tag: "Work" }]);

    const { result } = renderHook(() => useCategoryTags({}));
    await act(async () => {});

    expect(result.current.tags).toEqual(["Health", "Work"]);
  });

  it("defaults to [null] when no tags are returned", async () => {
    mockDb.getAllAsync.mockResolvedValue([]);

    const { result } = renderHook(() => useCategoryTags({}));
    await act(async () => {});

    expect(result.current.tags).toEqual([null]);
  });

  it("appends 'Routines' when hasRoutines is true", async () => {
    mockDb.getAllAsync.mockResolvedValue([{ tag: "Health" }]);

    const { result } = renderHook(() => useCategoryTags({ hasRoutines: true }));
    await act(async () => {});

    expect(result.current.tags).toEqual(["Health", "Routines"]);
  });

  it("initializes selectedIndex to 0", async () => {
    mockDb.getAllAsync.mockResolvedValue([]);

    const { result } = renderHook(() => useCategoryTags({}));
    await act(async () => {});

    expect(result.current.selectedIndex).toBe(0);
  });

  it("setSelectedIndex updates selectedIndex", async () => {
    mockDb.getAllAsync.mockResolvedValue([{ tag: "A" }, { tag: "B" }]);

    const { result } = renderHook(() => useCategoryTags({}));
    await act(async () => {});

    act(() => result.current.setSelectedIndex(1));
    expect(result.current.selectedIndex).toBe(1);
  });
});
