import { describe, expect, it } from "vitest";
import dashboardReducer, {
  addCard,
  addWorkspace,
  createDefaultDashboardState,
  deleteCard,
  deleteWorkspace,
  reorderCards,
  setActiveWorkspace,
  setLanguage,
  updateCard,
  updateWorkspace
} from "./dashboardSlice";
import type { Card, DashboardState, Workspace } from "./types";

function getWorkspaceIds(state: DashboardState) {
  return state.workspaces.map((workspace) => workspace.id);
}

function getCardIds(state: DashboardState) {
  return state.workspaces.flatMap((workspace) =>
    workspace.cards.map((card) => card.id)
  );
}

function createWorkspace(overrides?: Partial<Workspace>): Workspace {
  return {
    id: 1,
    title: "",
    subtitle: "",
    theme: "magenta",
    cards: [],
    ...overrides
  };
}

function createCard(overrides?: Partial<Card>): Card {
  return {
    id: 1,
    title: "",
    subtitle: "",
    description: "",
    ...overrides
  };
}

describe("dashboardSlice workspaces", () => {
  it("default state contains exactly one valid workspace", () => {
    const state = createDefaultDashboardState();

    expect(state.workspaces).toHaveLength(1);
    expect(state.workspaces[0]).toEqual(
      expect.objectContaining({
        id: 1,
        title: "",
        subtitle: "",
        theme: "magenta",
        cards: []
      })
    );
    expect(state.activeWorkspaceId).toBe(1);
    expect(state.language).toBe("en");
  });

  it("addWorkspace creates a unique positive integer ID and activates it", () => {
    const previousState = createDefaultDashboardState();
    const nextState = dashboardReducer(previousState, addWorkspace());
    const addedWorkspace = nextState.workspaces[nextState.workspaces.length - 1];

    expect(Number.isSafeInteger(addedWorkspace.id)).toBe(true);
    expect(addedWorkspace.id).toBeGreaterThan(0);
    expect(new Set(getWorkspaceIds(nextState)).size).toBe(nextState.workspaces.length);
    expect(nextState.activeWorkspaceId).toBe(addedWorkspace.id);
  });

  it("addWorkspace cycles workspace themes correctly", () => {
    let state = createDefaultDashboardState();

    state = dashboardReducer(state, addWorkspace());
    state = dashboardReducer(state, addWorkspace());
    state = dashboardReducer(state, addWorkspace());
    state = dashboardReducer(state, addWorkspace());

    expect(state.workspaces.map((workspace) => workspace.theme)).toEqual([
      "magenta",
      "citrus",
      "violet",
      "orange",
      "magenta"
    ]);
  });

  it("multiple added workspaces continue to receive unique IDs", () => {
    let state = createDefaultDashboardState();

    state = dashboardReducer(state, addWorkspace());
    state = dashboardReducer(state, addWorkspace());
    state = dashboardReducer(state, addWorkspace());

    const workspaceIds = getWorkspaceIds(state);

    expect(new Set(workspaceIds).size).toBe(workspaceIds.length);
    expect(workspaceIds.every((workspaceId) => workspaceId > 0)).toBe(true);
  });

  it("deleting the final remaining workspace does nothing", () => {
    const state = createDefaultDashboardState();
    const nextState = dashboardReducer(state, deleteWorkspace({ workspaceId: 1 }));

    expect(nextState).toEqual(state);
  });

  it("deleting an inactive workspace preserves activeWorkspaceId", () => {
    let state = createDefaultDashboardState();
    state = dashboardReducer(state, addWorkspace());
    state = dashboardReducer(state, addWorkspace());

    const activeWorkspaceId = state.activeWorkspaceId;
    const inactiveWorkspaceId = state.workspaces[0].id;

    const nextState = dashboardReducer(
      state,
      deleteWorkspace({ workspaceId: inactiveWorkspaceId })
    );

    expect(nextState.activeWorkspaceId).toBe(activeWorkspaceId);
    expect(nextState.workspaces.some((workspace) => workspace.id === activeWorkspaceId)).toBe(
      true
    );
  });

  it("deleting the active workspace selects the intended deterministic neighbor", () => {
    let state = createDefaultDashboardState();
    state = dashboardReducer(state, addWorkspace());
    state = dashboardReducer(state, addWorkspace());
    const activeWorkspaceId = state.activeWorkspaceId;

    const nextState = dashboardReducer(
      state,
      deleteWorkspace({ workspaceId: activeWorkspaceId })
    );

    expect(nextState.activeWorkspaceId).toBe(
      nextState.workspaces[nextState.workspaces.length - 1].id
    );
  });

  it("deleting a nonexistent workspace does nothing", () => {
    const state = createDefaultDashboardState();
    const nextState = dashboardReducer(
      state,
      deleteWorkspace({ workspaceId: 999 })
    );

    expect(nextState).toEqual(state);
  });

  it("setActiveWorkspace only accepts an existing workspace ID", () => {
    let state = createDefaultDashboardState();
    state = dashboardReducer(state, addWorkspace());
    const validWorkspaceId = state.workspaces[0].id;

    const activatedState = dashboardReducer(
      state,
      setActiveWorkspace({ workspaceId: validWorkspaceId })
    );
    const rejectedState = dashboardReducer(
      activatedState,
      setActiveWorkspace({ workspaceId: 999 })
    );

    expect(activatedState.activeWorkspaceId).toBe(validWorkspaceId);
    expect(rejectedState.activeWorkspaceId).toBe(validWorkspaceId);
  });
});

describe("dashboardSlice workspace editing", () => {
  it("updateWorkspace can update only title", () => {
    const state = createDefaultDashboardState();
    const nextState = dashboardReducer(
      state,
      updateWorkspace({
        workspaceId: state.workspaces[0].id,
        changes: { title: "New title" }
      })
    );

    expect(nextState.workspaces[0].title).toBe("New title");
    expect(nextState.workspaces[0].subtitle).toBe("");
  });

  it("updateWorkspace can update only subtitle", () => {
    const state = createDefaultDashboardState();
    const nextState = dashboardReducer(
      state,
      updateWorkspace({
        workspaceId: state.workspaces[0].id,
        changes: { subtitle: "New subtitle" }
      })
    );

    expect(nextState.workspaces[0].title).toBe("");
    expect(nextState.workspaces[0].subtitle).toBe("New subtitle");
  });

  it("updateWorkspace does not modify unrelated fields or workspaces", () => {
    let state = createDefaultDashboardState();
    state = dashboardReducer(state, addWorkspace());
    const untouchedWorkspace = state.workspaces[1];

    const nextState = dashboardReducer(
      state,
      updateWorkspace({
        workspaceId: state.workspaces[0].id,
        changes: { title: "Updated" }
      })
    );

    expect(nextState.workspaces[0].title).toBe("Updated");
    expect(nextState.workspaces[0].subtitle).toBe("");
    expect(nextState.workspaces[1]).toEqual(untouchedWorkspace);
  });

  it("updateWorkspace ignores nonexistent workspace IDs", () => {
    const state = createDefaultDashboardState();
    const nextState = dashboardReducer(
      state,
      updateWorkspace({
        workspaceId: 999,
        changes: { title: "Ignored" }
      })
    );

    expect(nextState).toEqual(state);
  });
});

describe("dashboardSlice cards", () => {
  it("addCard creates a globally unique positive integer card ID", () => {
    let state = createDefaultDashboardState();
    state = dashboardReducer(state, addWorkspace());
    const workspaceId = state.workspaces[0].id;

    const nextState = dashboardReducer(state, addCard({ workspaceId }));
    const cardIds = getCardIds(nextState);

    expect(cardIds.length).toBeGreaterThan(1);
    expect(new Set(cardIds).size).toBe(cardIds.length);
    expect(cardIds.every((cardId) => Number.isSafeInteger(cardId) && cardId > 0)).toBe(
      true
    );
  });

  it("card IDs remain unique across multiple workspaces", () => {
    let state = createDefaultDashboardState();
    state = dashboardReducer(state, addWorkspace());
    state = dashboardReducer(state, addWorkspace());
    state = dashboardReducer(state, addCard({ workspaceId: state.workspaces[0].id }));
    state = dashboardReducer(state, addCard({ workspaceId: state.workspaces[1].id }));

    const cardIds = getCardIds(state);

    expect(new Set(cardIds).size).toBe(cardIds.length);
  });

  it("updateCard can update one field without changing other fields", () => {
    let state = createDefaultDashboardState();
    state = dashboardReducer(state, addWorkspace());
    const workspace = state.workspaces[1];
    const card = workspace.cards[0];

    const nextState = dashboardReducer(
      state,
      updateCard({
        workspaceId: workspace.id,
        cardId: card.id,
        changes: { description: "Updated description" }
      })
    );

    expect(nextState.workspaces[1].cards[0]).toEqual({
      ...card,
      description: "Updated description"
    });
  });

  it("updateCard does not modify unrelated cards or workspaces", () => {
    const state: DashboardState = {
      workspaces: [
        createWorkspace({
          id: 1,
          cards: [createCard({ id: 1, title: "A" }), createCard({ id: 2, title: "B" })]
        }),
        createWorkspace({
          id: 2,
          theme: "citrus",
          cards: [createCard({ id: 3, title: "C" })]
        })
      ],
      activeWorkspaceId: 1,
      language: "en"
    };

    const nextState = dashboardReducer(
      state,
      updateCard({
        workspaceId: 1,
        cardId: 2,
        changes: { subtitle: "Updated subtitle" }
      })
    );

    expect(nextState.workspaces[0].cards[0]).toEqual(state.workspaces[0].cards[0]);
    expect(nextState.workspaces[0].cards[1]).toEqual({
      ...state.workspaces[0].cards[1],
      subtitle: "Updated subtitle"
    });
    expect(nextState.workspaces[1]).toEqual(state.workspaces[1]);
  });

  it("deleteCard deletes only the requested card", () => {
    const state: DashboardState = {
      workspaces: [
        createWorkspace({
          id: 1,
          cards: [createCard({ id: 1 }), createCard({ id: 2 }), createCard({ id: 3 })]
        })
      ],
      activeWorkspaceId: 1,
      language: "en"
    };

    const nextState = dashboardReducer(
      state,
      deleteCard({ workspaceId: 1, cardId: 2 })
    );

    expect(nextState.workspaces[0].cards.map((card) => card.id)).toEqual([1, 3]);
  });

  it("deleteCard ignores nonexistent cards and workspaces", () => {
    let state = createDefaultDashboardState();
    state = dashboardReducer(state, addWorkspace());

    const missingCardState = dashboardReducer(
      state,
      deleteCard({ workspaceId: state.workspaces[1].id, cardId: 999 })
    );
    const missingWorkspaceState = dashboardReducer(
      state,
      deleteCard({ workspaceId: 999, cardId: 1 })
    );

    expect(missingCardState).toEqual(state);
    expect(missingWorkspaceState).toEqual(state);
  });

  it("reorderCards changes order correctly and preserves card content", () => {
    const state: DashboardState = {
      workspaces: [
        createWorkspace({
          id: 1,
          cards: [
            createCard({ id: 1, title: "One" }),
            createCard({ id: 2, title: "Two" }),
            createCard({ id: 3, title: "Three" })
          ]
        })
      ],
      activeWorkspaceId: 1,
      language: "en"
    };

    const nextState = dashboardReducer(
      state,
      reorderCards({ workspaceId: 1, activeCardId: 1, overCardId: 3 })
    );

    expect(nextState.workspaces[0].cards.map((card) => card.id)).toEqual([2, 3, 1]);
    expect(nextState.workspaces[0].cards).toEqual([
      state.workspaces[0].cards[1],
      state.workspaces[0].cards[2],
      state.workspaces[0].cards[0]
    ]);
  });

  it("reorderCards ignores invalid IDs", () => {
    const state: DashboardState = {
      workspaces: [
        createWorkspace({
          id: 1,
          cards: [createCard({ id: 1 }), createCard({ id: 2 })]
        })
      ],
      activeWorkspaceId: 1,
      language: "en"
    };

    const missingActiveState = dashboardReducer(
      state,
      reorderCards({ workspaceId: 1, activeCardId: 999, overCardId: 2 })
    );
    const missingOverState = dashboardReducer(
      state,
      reorderCards({ workspaceId: 1, activeCardId: 1, overCardId: 999 })
    );
    const missingWorkspaceState = dashboardReducer(
      state,
      reorderCards({ workspaceId: 999, activeCardId: 1, overCardId: 2 })
    );

    expect(missingActiveState).toEqual(state);
    expect(missingOverState).toEqual(state);
    expect(missingWorkspaceState).toEqual(state);
  });

  it("reorderCards does nothing when activeCardId === overCardId", () => {
    const state: DashboardState = {
      workspaces: [
        createWorkspace({
          id: 1,
          cards: [createCard({ id: 1 }), createCard({ id: 2 })]
        })
      ],
      activeWorkspaceId: 1,
      language: "en"
    };

    const nextState = dashboardReducer(
      state,
      reorderCards({ workspaceId: 1, activeCardId: 1, overCardId: 1 })
    );

    expect(nextState).toEqual(state);
  });
});

describe("dashboardSlice language", () => {
  it("setLanguage updates language correctly", () => {
    const state = createDefaultDashboardState();
    const nextState = dashboardReducer(state, setLanguage({ language: "no" }));

    expect(nextState.language).toBe("no");
  });
});
