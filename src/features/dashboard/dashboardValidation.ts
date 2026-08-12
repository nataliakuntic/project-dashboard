import { isLanguage } from "../../translations";
import { WORKSPACE_THEMES, type WorkspaceTheme } from "./dashboardThemes";
import type { Card, DashboardState, Workspace } from "./types";

function isPositiveSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function isWorkspaceTheme(value: unknown): value is WorkspaceTheme {
  return typeof value === "string" && WORKSPACE_THEMES.includes(value as WorkspaceTheme);
}

function isCard(value: unknown): value is Card {
  if (!value || typeof value !== "object") {
    return false;
  }

  const card = value as Record<string, unknown>;

  return (
    isPositiveSafeInteger(card.id) &&
    typeof card.title === "string" &&
    typeof card.subtitle === "string" &&
    typeof card.description === "string"
  );
}

function isWorkspace(value: unknown): value is Workspace {
  if (!value || typeof value !== "object") {
    return false;
  }

  const workspace = value as Record<string, unknown>;

  return (
    isPositiveSafeInteger(workspace.id) &&
    typeof workspace.title === "string" &&
    typeof workspace.subtitle === "string" &&
    isWorkspaceTheme(workspace.theme) &&
    Array.isArray(workspace.cards) &&
    workspace.cards.every(isCard)
  );
}

function hasUniqueWorkspaceIds(workspaces: Workspace[]) {
  const workspaceIds = new Set<number>();

  for (const workspace of workspaces) {
    if (workspaceIds.has(workspace.id)) {
      return false;
    }

    workspaceIds.add(workspace.id);
  }

  return true;
}

function hasUniqueCardIds(workspaces: Workspace[]) {
  const cardIds = new Set<number>();

  for (const workspace of workspaces) {
    for (const card of workspace.cards) {
      if (cardIds.has(card.id)) {
        return false;
      }

      cardIds.add(card.id);
    }
  }

  return true;
}

export function isDashboardState(value: unknown): value is DashboardState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const dashboardState = value as Record<string, unknown>;
  const { workspaces, activeWorkspaceId, language } = dashboardState;

  if (
    !Array.isArray(workspaces) ||
    workspaces.length === 0 ||
    !workspaces.every(isWorkspace) ||
    !hasUniqueWorkspaceIds(workspaces) ||
    !hasUniqueCardIds(workspaces) ||
    !isPositiveSafeInteger(activeWorkspaceId) ||
    !workspaces.some((workspace) => workspace.id === activeWorkspaceId) ||
    !isLanguage(language)
  ) {
    return false;
  }

  return true;
}
