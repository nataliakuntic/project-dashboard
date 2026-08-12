import { createDefaultDashboardState } from "./dashboardSlice";
import { isDashboardState } from "./dashboardValidation";
import type { DashboardState } from "./types";

type PersistedDashboardState = DashboardState & {
  version: number;
};

export const STORAGE_KEY = "project-dashboard-state";
export const CURRENT_STORAGE_VERSION = 1;

export function loadDashboardState(): DashboardState {
  if (typeof window === "undefined") {
    return createDefaultDashboardState();
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return createDefaultDashboardState();
    }

    const parsedValue = JSON.parse(rawValue) as Partial<PersistedDashboardState>;

    if (parsedValue.version !== CURRENT_STORAGE_VERSION) {
      return createDefaultDashboardState();
    }

    if (!isDashboardState(parsedValue)) {
      return createDefaultDashboardState();
    }

    return {
      workspaces: parsedValue.workspaces,
      activeWorkspaceId: parsedValue.activeWorkspaceId,
      language: parsedValue.language
    };
  } catch {
    return createDefaultDashboardState();
  }
}

export function saveDashboardState(state: DashboardState): void {
  try {
    const persistedState: PersistedDashboardState = {
      version: CURRENT_STORAGE_VERSION,
      ...state
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
  } catch {
    // Ignore storage failures and keep the app working in memory.
  }
}
