import { afterEach, describe, expect, it, vi } from "vitest";
import { createDefaultDashboardState } from "./dashboardSlice";
import {
  CURRENT_STORAGE_VERSION,
  loadDashboardState,
  saveDashboardState,
  STORAGE_KEY
} from "./dashboardStorage";

type LocalStorageMock = {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
};

function setWindowWithStorage(localStorage: LocalStorageMock) {
  Object.defineProperty(globalThis, "window", {
    value: { localStorage },
    configurable: true,
    writable: true
  });
}

function createLocalStorageMock(overrides?: Partial<LocalStorageMock>): LocalStorageMock {
  return {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    ...overrides
  };
}

const validPersistedState = {
  version: CURRENT_STORAGE_VERSION,
  workspaces: [
    {
      id: 1,
      title: "",
      subtitle: "",
      theme: "magenta",
      cards: [
        {
          id: 1,
          title: "",
          subtitle: "",
          description: ""
        }
      ]
    },
    {
      id: 2,
      title: "Workspace 2",
      subtitle: "",
      theme: "citrus",
      cards: [
        {
          id: 2,
          title: "Card 2",
          subtitle: "",
          description: ""
        }
      ]
    }
  ],
  activeWorkspaceId: 2,
  language: "no"
} as const;

afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
  vi.restoreAllMocks();
});

describe("dashboardStorage loadDashboardState", () => {
  it("missing localStorage value returns default dashboard state", () => {
    setWindowWithStorage(createLocalStorageMock());

    expect(loadDashboardState()).toEqual(createDefaultDashboardState());
  });

  it("malformed JSON returns default dashboard state", () => {
    setWindowWithStorage(
      createLocalStorageMock({
        getItem: vi.fn(() => "{bad json")
      })
    );

    expect(loadDashboardState()).toEqual(createDefaultDashboardState());
  });

  it("wrong storage version returns default dashboard state", () => {
    setWindowWithStorage(
      createLocalStorageMock({
        getItem: vi.fn(() =>
          JSON.stringify({
            ...validPersistedState,
            version: CURRENT_STORAGE_VERSION + 1
          })
        )
      })
    );

    expect(loadDashboardState()).toEqual(createDefaultDashboardState());
  });

  it("valid state loads correctly", () => {
    setWindowWithStorage(
      createLocalStorageMock({
        getItem: vi.fn(() => JSON.stringify(validPersistedState))
      })
    );

    expect(loadDashboardState()).toEqual({
      workspaces: validPersistedState.workspaces,
      activeWorkspaceId: validPersistedState.activeWorkspaceId,
      language: validPersistedState.language
    });
  });

  it("empty workspaces is rejected", () => {
    setWindowWithStorage(
      createLocalStorageMock({
        getItem: vi.fn(() =>
          JSON.stringify({
            ...validPersistedState,
            workspaces: []
          })
        )
      })
    );

    expect(loadDashboardState()).toEqual(createDefaultDashboardState());
  });

  it("duplicate workspace IDs are rejected", () => {
    setWindowWithStorage(
      createLocalStorageMock({
        getItem: vi.fn(() =>
          JSON.stringify({
            ...validPersistedState,
            workspaces: [
              validPersistedState.workspaces[0],
              { ...validPersistedState.workspaces[1], id: 1 }
            ],
            activeWorkspaceId: 1
          })
        )
      })
    );

    expect(loadDashboardState()).toEqual(createDefaultDashboardState());
  });

  it("duplicate card IDs across different workspaces are rejected", () => {
    setWindowWithStorage(
      createLocalStorageMock({
        getItem: vi.fn(() =>
          JSON.stringify({
            ...validPersistedState,
            workspaces: [
              validPersistedState.workspaces[0],
              {
                ...validPersistedState.workspaces[1],
                cards: [{ ...validPersistedState.workspaces[1].cards[0], id: 1 }]
              }
            ]
          })
        )
      })
    );

    expect(loadDashboardState()).toEqual(createDefaultDashboardState());
  });

  it("invalid workspace theme is rejected", () => {
    setWindowWithStorage(
      createLocalStorageMock({
        getItem: vi.fn(() =>
          JSON.stringify({
            ...validPersistedState,
            workspaces: [
              {
                ...validPersistedState.workspaces[0],
                theme: "invalid-theme"
              }
            ]
          })
        )
      })
    );

    expect(loadDashboardState()).toEqual(createDefaultDashboardState());
  });

  it("invalid language is rejected", () => {
    setWindowWithStorage(
      createLocalStorageMock({
        getItem: vi.fn(() =>
          JSON.stringify({
            ...validPersistedState,
            language: "fr"
          })
        )
      })
    );

    expect(loadDashboardState()).toEqual(createDefaultDashboardState());
  });

  it("invalid and nonexistent activeWorkspaceId is rejected", () => {
    setWindowWithStorage(
      createLocalStorageMock({
        getItem: vi.fn(() =>
          JSON.stringify({
            ...validPersistedState,
            activeWorkspaceId: 999
          })
        )
      })
    );

    expect(loadDashboardState()).toEqual(createDefaultDashboardState());
  });

  it("non-integer ID is rejected", () => {
    setWindowWithStorage(
      createLocalStorageMock({
        getItem: vi.fn(() =>
          JSON.stringify({
            ...validPersistedState,
            workspaces: [
              {
                ...validPersistedState.workspaces[0],
                id: 1.5
              }
            ],
            activeWorkspaceId: 1.5
          })
        )
      })
    );

    expect(loadDashboardState()).toEqual(createDefaultDashboardState());
  });

  it("zero and negative IDs are rejected", () => {
    setWindowWithStorage(
      createLocalStorageMock({
        getItem: vi.fn(() =>
          JSON.stringify({
            ...validPersistedState,
            workspaces: [
              {
                ...validPersistedState.workspaces[0],
                id: 0,
                cards: [{ ...validPersistedState.workspaces[0].cards[0], id: -1 }]
              }
            ],
            activeWorkspaceId: 0
          })
        )
      })
    );

    expect(loadDashboardState()).toEqual(createDefaultDashboardState());
  });

  it("unsafe integer ID is rejected", () => {
    const unsafeId = Number.MAX_SAFE_INTEGER + 1;

    setWindowWithStorage(
      createLocalStorageMock({
        getItem: vi.fn(() =>
          JSON.stringify({
            ...validPersistedState,
            workspaces: [
              {
                ...validPersistedState.workspaces[0],
                id: unsafeId
              }
            ],
            activeWorkspaceId: unsafeId
          })
        )
      })
    );

    expect(loadDashboardState()).toEqual(createDefaultDashboardState());
  });

  it("storage read failure safely returns default state", () => {
    setWindowWithStorage(
      createLocalStorageMock({
        getItem: vi.fn(() => {
          throw new Error("read failed");
        })
      })
    );

    expect(loadDashboardState()).toEqual(createDefaultDashboardState());
  });
});

describe("dashboardStorage saveDashboardState", () => {
  it("valid state is saved with version 1", () => {
    const localStorage = createLocalStorageMock();
    setWindowWithStorage(localStorage);

    const state = createDefaultDashboardState();
    saveDashboardState(state);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        ...state
      })
    );
  });

  it("storage write failure does not crash", () => {
    setWindowWithStorage(
      createLocalStorageMock({
        setItem: vi.fn(() => {
          throw new Error("write failed");
        })
      })
    );

    expect(() => saveDashboardState(createDefaultDashboardState())).not.toThrow();
  });
});
