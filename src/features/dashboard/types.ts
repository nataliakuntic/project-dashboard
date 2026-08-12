import type { Language } from "../../translations";
import type { WorkspaceTheme } from "./dashboardThemes";

export type Card = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
};

export type Workspace = {
  id: number;
  title: string;
  subtitle: string;
  theme: WorkspaceTheme;
  cards: Card[];
};

export type DashboardState = {
  workspaces: Workspace[];
  activeWorkspaceId: number;
  language: Language;
};
