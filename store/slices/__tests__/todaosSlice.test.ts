import todaosReducer, {
  TodaosState,
  reloadTodao,
  todaoLoaded,
} from "../todaosSlice";

describe("todaosSlice", () => {
  it("has empty queries as initial state", () => {
    expect(todaosReducer(undefined, { type: "@@INIT" })).toEqual({
      queries: {},
    });
  });

  it("reloadTodao sets the query flag to true for the given id", () => {
    const result = todaosReducer({ queries: {} }, reloadTodao(42));
    expect(result.queries[42]).toBe(true);
  });

  it("todaoLoaded sets the query flag to false for the given id", () => {
    const state: TodaosState = { queries: { 42: true } };
    expect(todaosReducer(state, todaoLoaded(42)).queries[42]).toBe(false);
  });

  it("does not affect other ids", () => {
    const state: TodaosState = { queries: { 1: true, 2: true } };
    const result = todaosReducer(state, todaoLoaded(1));
    expect(result.queries[2]).toBe(true);
  });
});
