export const WORKSPACE_THEMES = [
  "magenta",
  "citrus",
  "violet",
  "orange"
] as const;

export type WorkspaceTheme = (typeof WORKSPACE_THEMES)[number];

export function getNextWorkspaceTheme(currentTheme: WorkspaceTheme): WorkspaceTheme {
  const currentIndex = WORKSPACE_THEMES.indexOf(currentTheme);

  return WORKSPACE_THEMES[(currentIndex + 1) % WORKSPACE_THEMES.length];
}
