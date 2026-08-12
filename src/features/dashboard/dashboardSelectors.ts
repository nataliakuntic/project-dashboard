import type { RootState } from "../../app/store";

const selectDashboardState = (state: RootState) => state.dashboard;

export const selectWorkspaces = (state: RootState) => selectDashboardState(state).workspaces;
export const selectActiveWorkspaceId = (state: RootState) =>
  selectDashboardState(state).activeWorkspaceId;
export const selectLanguage = (state: RootState) => selectDashboardState(state).language;

export const selectActiveWorkspace = (state: RootState) => {
  const dashboardState = selectDashboardState(state);

  return (
    dashboardState.workspaces.find(
      (workspace) => workspace.id === dashboardState.activeWorkspaceId
    ) ?? dashboardState.workspaces[0]
  );
};

export const selectCanNavigateWorkspaces = (state: RootState) =>
  selectWorkspaces(state).length > 1;

export const selectCanDeleteWorkspace = (state: RootState) =>
  selectWorkspaces(state).length > 1;
