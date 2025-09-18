import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// TBC: https://redux-toolkit.js.org/tutorials/quick-start

export interface TodaosState {
  queries: Record<number, boolean>;
}

const initialState: TodaosState = {
  queries: {},
};

export const todaosSlice = createSlice({
  name: "todaos",
  initialState,
  reducers: {
    reloadTodao: (state, action: PayloadAction<number>) => {
      state.queries[action.payload] = true;
    },
    todaoLoaded: (state, action: PayloadAction<number>) => {
      state.queries[action.payload] = false;
    },
  },
});

export const { reloadTodao, todaoLoaded } = todaosSlice.actions;

export default todaosSlice.reducer;
