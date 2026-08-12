import type { PointerEvent } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import WorkspacePanel from "./components/WorkspacePanel";
import { WORKSPACE_THEMES } from "./features/dashboard/dashboardThemes";
import {
  addCard,
  addWorkspace,
  deleteCard,
  deleteWorkspace,
  reorderCards,
  setActiveWorkspace,
  setLanguage,
  updateCard,
  updateWorkspace
} from "./features/dashboard/dashboardSlice";
import {
  selectActiveWorkspace,
  selectActiveWorkspaceId,
  selectCanDeleteWorkspace,
  selectCanNavigateWorkspaces,
  selectLanguage,
  selectWorkspaces
} from "./features/dashboard/dashboardSelectors";
import useWorkspaceCarousel from "./hooks/useWorkspaceCarousel";
import { translations } from "./translations";

function App() {
  const dispatch = useAppDispatch();
  const workspaces = useAppSelector(selectWorkspaces);
  const activeWorkspace = useAppSelector(selectActiveWorkspace);
  const activeWorkspaceId = useAppSelector(selectActiveWorkspaceId);
  const canNavigateWorkspaces = useAppSelector(selectCanNavigateWorkspaces);
  const canDeleteWorkspace = useAppSelector(selectCanDeleteWorkspace);
  const language = useAppSelector(selectLanguage);
  const uiText = translations[language];
  const {
    carouselIndex,
    isWorkspaceTransitionEnabled,
    renderedCarouselWorkspaces,
    goToNextWorkspace,
    goToPreviousWorkspace,
    handleWorkspaceTrackTransitionEnd
  } = useWorkspaceCarousel({
    workspaces,
    activeWorkspaceId,
    onActiveWorkspaceChange: (workspaceId) =>
      dispatch(setActiveWorkspace({ workspaceId }))
  });

  const handleAddProject = () => {
    dispatch(addWorkspace());
  };

  const handleAddCard = (workspaceId: number) => {
    dispatch(addCard({ workspaceId }));
  };

  const handleDeleteWorkspace = (workspaceId: number) => {
    if (workspaces.length <= 1) {
      return;
    }

    if (!workspaces.some((workspace) => workspace.id === workspaceId)) {
      return;
    }

    dispatch(deleteWorkspace({ workspaceId }));
  };

  const handleHeaderLanguageSwitchPointerDown = (
    event: PointerEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
  };

  return (
    <main
      className="project-dashboard"
      data-active-workspace-theme={activeWorkspace?.theme ?? WORKSPACE_THEMES[0]}
    >
      <header className="dashboard-hero">
        <div className="dashboard-shell dashboard-shell-hero">
          <div className="dashboard-hero-row">
            <h1 className="dashboard-heading">Project Dashboard</h1>

            <div className="dashboard-language-controls">
              <div className="dashboard-language-switch">
                <button
                  type="button"
                  className={`dashboard-language-button${
                    language === "en" ? " is-active" : ""
                  }`}
                  aria-label="Use English"
                  aria-pressed={language === "en"}
                  onClick={() => dispatch(setLanguage({ language: "en" }))}
                  onPointerDown={handleHeaderLanguageSwitchPointerDown}
                >
                  EN
                </button>
                <span className="dashboard-language-separator" aria-hidden="true" />
                <button
                  type="button"
                  className={`dashboard-language-button${
                    language === "no" ? " is-active" : ""
                  }`}
                  aria-label="Bruk norsk"
                  aria-pressed={language === "no"}
                  onClick={() => dispatch(setLanguage({ language: "no" }))}
                  onPointerDown={handleHeaderLanguageSwitchPointerDown}
                >
                  NO
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="dashboard-workspace" aria-label="Project workspace">
        <div className="workspace-viewport">
          <div
            className={`workspace-track${
              isWorkspaceTransitionEnabled ? "" : " no-transition"
            }`}
            style={{
              transform: `translateX(-${carouselIndex * 100}%)`
            }}
            onTransitionEnd={handleWorkspaceTrackTransitionEnd}
          >
            {renderedCarouselWorkspaces.map(({ key, workspace }) => (
              <div className="workspace-slide" key={key}>
                <WorkspacePanel
                  workspace={workspace}
                  uiText={uiText}
                  canNavigateWorkspaces={canNavigateWorkspaces}
                  onGoPrev={goToPreviousWorkspace}
                  onGoNext={goToNextWorkspace}
                  canDeleteWorkspace={canDeleteWorkspace}
                  onDeleteWorkspace={() => handleDeleteWorkspace(workspace.id)}
                  onAddCard={() => handleAddCard(workspace.id)}
                  onAddProject={handleAddProject}
                  onUpdateTitle={(nextValue) =>
                    dispatch(
                      updateWorkspace({
                        workspaceId: workspace.id,
                        changes: {
                          title: nextValue
                        }
                      })
                    )
                  }
                  onUpdateSubtitle={(nextValue) =>
                    dispatch(
                      updateWorkspace({
                        workspaceId: workspace.id,
                        changes: {
                          subtitle: nextValue
                        }
                      })
                    )
                  }
                  onUpdateCard={(cardId, field, nextValue) =>
                    dispatch(
                      updateCard({
                        workspaceId: workspace.id,
                        cardId,
                        changes: {
                          [field]: nextValue
                        }
                      })
                    )
                  }
                  onDeleteCard={(cardId) =>
                    dispatch(deleteCard({ workspaceId: workspace.id, cardId }))
                  }
                  onReorderCards={(workspaceId, activeCardId, overCardId) =>
                    dispatch(
                      reorderCards({
                        workspaceId,
                        activeCardId,
                        overCardId
                      })
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
