import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Language } from "../../translations";
import {
  WORKSPACE_THEMES,
  getNextWorkspaceTheme,
  type WorkspaceTheme
} from "./dashboardThemes";
import type { Card, DashboardState, Workspace } from "./types";

type UpdateWorkspacePayload = {
  workspaceId: number;
  changes: Partial<Pick<Workspace, "title" | "subtitle">>;
};

type AddCardPayload = {
  workspaceId: number;
};

type DeleteWorkspacePayload = {
  workspaceId: number;
};

type SetActiveWorkspacePayload = {
  workspaceId: number;
};

type DeleteCardPayload = {
  workspaceId: number;
  cardId: number;
};

type UpdateCardPayload = {
  workspaceId: number;
  cardId: number;
  changes: Partial<Pick<Card, "title" | "subtitle" | "description">>;
};

type ReorderCardsPayload = {
  workspaceId: number;
  activeCardId: number;
  overCardId: number;
};

type SetLanguagePayload = {
  language: Language;
};

function createEmptyCard(id: number): Card {
  return {
    id,
    title: "",
    subtitle: "",
    description: ""
  };
}

function createInitialWorkspace(): Workspace {
  return {
    id: 1,
    title: "",
    subtitle: "",
    theme: WORKSPACE_THEMES[0],
    cards: []
  };
}

function createWorkspace(
  id: number,
  cardId: number,
  theme: WorkspaceTheme
): Workspace {
  return {
    id,
    title: "",
    subtitle: "",
    theme,
    cards: [createEmptyCard(cardId)]
  };
}

function getNextWorkspaceId(workspaces: Workspace[]) {
  return Math.max(0, ...workspaces.map((workspace) => workspace.id)) + 1;
}

function getNextCardId(workspaces: Workspace[]) {
  return (
    Math.max(
      0,
      ...workspaces.flatMap((workspace) => workspace.cards.map((card) => card.id))
    ) + 1
  );
}

function reorderWorkspaceCards(cards: Card[], oldIndex: number, newIndex: number) {
  const nextCards = cards.slice();
  const [movedCard] = nextCards.splice(oldIndex, 1);
  nextCards.splice(newIndex, 0, movedCard);
  return nextCards;
}

export function createDefaultDashboardState(): DashboardState {
  const initialWorkspace = createInitialWorkspace();

  return {
    workspaces: [initialWorkspace],
    activeWorkspaceId: initialWorkspace.id,
    language: "en"
  };
}

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: createDefaultDashboardState(),
  reducers: {
    addWorkspace(state) {
      const workspaceId = getNextWorkspaceId(state.workspaces);
      const cardId = getNextCardId(state.workspaces);
      const lastWorkspaceTheme =
        state.workspaces[state.workspaces.length - 1]?.theme ?? WORKSPACE_THEMES[0];
      const nextWorkspace = createWorkspace(
        workspaceId,
        cardId,
        getNextWorkspaceTheme(lastWorkspaceTheme)
      );

      state.workspaces.push(nextWorkspace);
      state.activeWorkspaceId = nextWorkspace.id;
    },
    deleteWorkspace(state, action: PayloadAction<DeleteWorkspacePayload>) {
      if (state.workspaces.length <= 1) {
        return;
      }

      const deleteIndex = state.workspaces.findIndex(
        (workspace) => workspace.id === action.payload.workspaceId
      );

      if (deleteIndex === -1) {
        return;
      }

      const nextWorkspaces = state.workspaces.filter(
        (workspace) => workspace.id !== action.payload.workspaceId
      );

      if (state.activeWorkspaceId === action.payload.workspaceId) {
        state.activeWorkspaceId =
          nextWorkspaces[Math.min(deleteIndex, nextWorkspaces.length - 1)].id;
      } else if (!nextWorkspaces.some((workspace) => workspace.id === state.activeWorkspaceId)) {
        state.activeWorkspaceId = nextWorkspaces[0].id;
      }

      state.workspaces = nextWorkspaces;
    },
    setActiveWorkspace(state, action: PayloadAction<SetActiveWorkspacePayload>) {
      if (
        state.workspaces.some((workspace) => workspace.id === action.payload.workspaceId)
      ) {
        state.activeWorkspaceId = action.payload.workspaceId;
      }
    },
    updateWorkspace(state, action: PayloadAction<UpdateWorkspacePayload>) {
      const workspace = state.workspaces.find(
        (currentWorkspace) => currentWorkspace.id === action.payload.workspaceId
      );

      if (!workspace) {
        return;
      }

      if (action.payload.changes.title != null) {
        workspace.title = action.payload.changes.title;
      }

      if (action.payload.changes.subtitle != null) {
        workspace.subtitle = action.payload.changes.subtitle;
      }
    },
    addCard(state, action: PayloadAction<AddCardPayload>) {
      const workspace = state.workspaces.find(
        (currentWorkspace) => currentWorkspace.id === action.payload.workspaceId
      );

      if (!workspace) {
        return;
      }

      workspace.cards.push(createEmptyCard(getNextCardId(state.workspaces)));
    },
    deleteCard(state, action: PayloadAction<DeleteCardPayload>) {
      const workspace = state.workspaces.find(
        (currentWorkspace) => currentWorkspace.id === action.payload.workspaceId
      );

      if (!workspace) {
        return;
      }

      workspace.cards = workspace.cards.filter(
        (card) => card.id !== action.payload.cardId
      );
    },
    updateCard(state, action: PayloadAction<UpdateCardPayload>) {
      const workspace = state.workspaces.find(
        (currentWorkspace) => currentWorkspace.id === action.payload.workspaceId
      );

      if (!workspace) {
        return;
      }

      const card = workspace.cards.find(
        (currentCard) => currentCard.id === action.payload.cardId
      );

      if (!card) {
        return;
      }

      if (action.payload.changes.title != null) {
        card.title = action.payload.changes.title;
      }

      if (action.payload.changes.subtitle != null) {
        card.subtitle = action.payload.changes.subtitle;
      }

      if (action.payload.changes.description != null) {
        card.description = action.payload.changes.description;
      }
    },
    reorderCards(state, action: PayloadAction<ReorderCardsPayload>) {
      const workspace = state.workspaces.find(
        (currentWorkspace) => currentWorkspace.id === action.payload.workspaceId
      );

      if (!workspace) {
        return;
      }

      const oldIndex = workspace.cards.findIndex(
        (card) => card.id === action.payload.activeCardId
      );
      const newIndex = workspace.cards.findIndex(
        (card) => card.id === action.payload.overCardId
      );

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return;
      }

      workspace.cards = reorderWorkspaceCards(workspace.cards, oldIndex, newIndex);
    },
    setLanguage(state, action: PayloadAction<SetLanguagePayload>) {
      state.language = action.payload.language;
    }
  }
});

export const {
  addWorkspace,
  deleteWorkspace,
  setActiveWorkspace,
  updateWorkspace,
  addCard,
  deleteCard,
  updateCard,
  reorderCards,
  setLanguage
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
