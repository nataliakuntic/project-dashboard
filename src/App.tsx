import { useAppDispatch, useAppSelector } from "./app/hooks";
import WorkspacePanel from "./components/WorkspacePanel";
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

  return (
    <main className="project-dashboard" data-active-workspace-theme={activeWorkspace.theme}>
      <header className="dashboard-hero">
        <div className="dashboard-shell dashboard-shell-hero">
          <div className="dashboard-hero-row">
            <h1 className="dashboard-heading">All My Sideprojects</h1>

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
                  onDeleteWorkspace={() =>
                    dispatch(deleteWorkspace({ workspaceId: workspace.id }))
                  }
                  onAddCard={() => dispatch(addCard({ workspaceId: workspace.id }))}
                  onAddProject={() => dispatch(addWorkspace())}
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
