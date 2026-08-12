export type Language = "en" | "no";

export const translations = {
  en: {
    projectTitlePlaceholder: "Your Project",
    projectSubtitlePlaceholder: "Describe your project in one short sentence",
    cardTitlePlaceholder: "Untitled card",
    cardSubtitlePlaceholder: "Add a short subtitle",
    cardDescriptionPlaceholder: "Write a note, task, or idea here.",
    addCard: "Add card",
    addProject: "Add project",
    deleteProject: "Delete project",
    previousWorkspace: "Previous workspace",
    nextWorkspace: "Next workspace"
  },
  no: {
    projectTitlePlaceholder: "Prosjektet ditt",
    projectSubtitlePlaceholder: "Beskriv prosjektet ditt med én kort setning",
    cardTitlePlaceholder: "Kort uten tittel",
    cardSubtitlePlaceholder: "Legg til en kort undertittel",
    cardDescriptionPlaceholder: "Skriv et notat, en oppgave eller en idé her.",
    addCard: "Legg til kort",
    addProject: "Legg til prosjekt",
    deleteProject: "Slett prosjekt",
    previousWorkspace: "Forrige prosjekt",
    nextWorkspace: "Neste prosjekt"
  }
} as const;

export type TranslationSet = (typeof translations)[Language];

export function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "no";
}
