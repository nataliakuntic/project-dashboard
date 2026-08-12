import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import {
  loadDashboardState,
  saveDashboardState
} from "../features/dashboard/dashboardStorage";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer
  },
  preloadedState: {
    dashboard: loadDashboardState()
  }
});

let previousDashboardState = store.getState().dashboard;

store.subscribe(() => {
  const nextDashboardState = store.getState().dashboard;

  if (nextDashboardState === previousDashboardState) {
    return;
  }

  previousDashboardState = nextDashboardState;
  saveDashboardState(nextDashboardState);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
