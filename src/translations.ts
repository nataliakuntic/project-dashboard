export type Language = "en" | "no";

export const translations = {
  en: {
    projectTitlePlaceholder: "Your Project",
    projectSubtitlePlaceholder: "Describe your project in one short sentence",
    cardTitlePlaceholder: "Untitled card",
    cardSubtitlePlaceholder: "Add a short subtitle",
    cardDescriptionPlaceholder: "Write a note, task, or idea here.",
    moveCard: "Move card",
    addCard: "Add card",
    addProject: "Add project",
    deleteProject: "Delete project",
    deleteProjectDialogTitle: "Delete project?",
    deleteProjectConfirmation: "Are you sure you want to delete",
    deleteUntitledProjectConfirmation:
      "Are you sure you want to delete this untitled project?",
    cancel: "Cancel",
    previousWorkspace: "Previous workspace",
    nextWorkspace: "Next workspace"
  },
  no: {
    projectTitlePlaceholder: "Prosjektet ditt",
    projectSubtitlePlaceholder: "Beskriv prosjektet ditt med én kort setning",
    cardTitlePlaceholder: "Kort uten tittel",
    cardSubtitlePlaceholder: "Legg til en kort undertittel",
    cardDescriptionPlaceholder: "Skriv et notat, en oppgave eller en idé her.",
    moveCard: "Flytt kort",
    addCard: "Legg til kort",
    addProject: "Legg til prosjekt",
    deleteProject: "Slett prosjekt",
    deleteProjectDialogTitle: "Slette prosjekt?",
    deleteProjectConfirmation: "Er du sikker på at du vil slette",
    deleteUntitledProjectConfirmation:
      "Er du sikker på at du vil slette dette prosjektet uten tittel?",
    cancel: "Avbryt",
    previousWorkspace: "Forrige prosjekt",
    nextWorkspace: "Neste prosjekt"
  }
} as const;

export type TranslationSet = (typeof translations)[Language];

export function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "no";
}
