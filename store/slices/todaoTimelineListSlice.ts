import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// TBC: https://redux-toolkit.js.org/tutorials/quick-start

export interface CounterState {
  reloadDB: boolean;
}

const initialState: CounterState = {
  reloadDB: true,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    reloadTimeline: (state) => {
      state.reloadDB = true;
    },
    timelineLoaded: (state) => {
      state.reloadDB = false;
    },
  },
});

export const { reloadTimeline, timelineLoaded } = counterSlice.actions;

export default counterSlice.reducer;
