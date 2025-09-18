import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/todaoTimelineListSlice";
import todaosReducer from "./slices/todaosSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todaos: todaosReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
