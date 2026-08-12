import { describe, expect, it } from "vitest";
import type { RootState } from "../../app/store";
import {
  selectActiveWorkspace,
  selectActiveWorkspaceIndex,
  selectCanDeleteWorkspace,
  selectCanNavigateWorkspaces
} from "./dashboardSelectors";

function createState(activeWorkspaceId = 2): RootState {
  return {
    dashboard: {
      workspaces: [
        {
          id: 1,
          title: "One",
          subtitle: "",
          theme: "magenta",
          cards: []
        },
        {
          id: 2,
          title: "Two",
          subtitle: "",
          theme: "citrus",
          cards: []
        }
      ],
      activeWorkspaceId,
      language: "en"
    }
  };
}

describe("dashboardSelectors", () => {
  it("selectActiveWorkspace returns the active workspace", () => {
    const state = createState();

    expect(selectActiveWorkspace(state)).toEqual(state.dashboard.workspaces[1]);
  });

  it("selectActiveWorkspaceIndex derives the active workspace index", () => {
    expect(selectActiveWorkspaceIndex(createState())).toBe(1);
  });

  it("selectActiveWorkspaceIndex falls back to 0 when the ID is missing", () => {
    expect(selectActiveWorkspaceIndex(createState(999))).toBe(0);
  });

  it("selectCanNavigateWorkspaces returns true only when there is more than one workspace", () => {
    const state = createState();

    expect(selectCanNavigateWorkspaces(state)).toBe(true);
    expect(
      selectCanNavigateWorkspaces({
        dashboard: {
          ...state.dashboard,
          workspaces: [state.dashboard.workspaces[0]]
        }
      })
    ).toBe(false);
  });

  it("selectCanDeleteWorkspace matches the delete invariant", () => {
    const state = createState();

    expect(selectCanDeleteWorkspace(state)).toBe(true);
    expect(
      selectCanDeleteWorkspace({
        dashboard: {
          ...state.dashboard,
          workspaces: [state.dashboard.workspaces[0]]
        }
      })
    ).toBe(false);
  });
});
