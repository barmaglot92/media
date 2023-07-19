import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { downloadAPI } from "../services/DownloadService";

const rootReducer = combineReducers({
  [downloadAPI.reducerPath]: downloadAPI.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(downloadAPI.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
