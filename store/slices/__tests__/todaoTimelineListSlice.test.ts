import counterReducer, {
  CounterState,
  reloadTimeline,
  timelineLoaded,
} from "../todaoTimelineListSlice";

describe("todaoTimelineListSlice", () => {
  it("has reloadDB: true as initial state", () => {
    expect(counterReducer(undefined, { type: "@@INIT" })).toEqual({
      reloadDB: true,
    });
  });

  it("reloadTimeline sets reloadDB to true", () => {
    const state: CounterState = { reloadDB: false };
    expect(counterReducer(state, reloadTimeline()).reloadDB).toBe(true);
  });

  it("timelineLoaded sets reloadDB to false", () => {
    const state: CounterState = { reloadDB: true };
    expect(counterReducer(state, timelineLoaded()).reloadDB).toBe(false);
  });
});
