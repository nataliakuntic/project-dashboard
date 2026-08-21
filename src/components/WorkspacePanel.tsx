import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TranslationSet } from "../translations";
import type { Workspace } from "../features/dashboard/types";
import CardGrid from "./CardGrid";
import TrashIcon from "./icons/TrashIcon";
import ProjectHeading from "./ProjectHeading";

type WorkspacePanelProps = {
  workspace: Workspace;
  uiText: TranslationSet;
  canNavigateWorkspaces: boolean;
  canDeleteWorkspace: boolean;
  onGoPrev: () => void;
  onGoNext: () => void;
  onDeleteWorkspace: () => void;
  onAddCard: () => void;
  onAddProject: () => void;
  onUpdateTitle: (nextValue: string) => void;
  onUpdateSubtitle: (nextValue: string) => void;
  onUpdateCard: (
    cardId: number,
    field: "title" | "subtitle" | "description",
    nextValue: string
  ) => void;
  onDeleteCard: (cardId: number) => void;
  onReorderCards: (
    workspaceId: number,
    activeCardId: number,
    overCardId: number
  ) => void;
};

function WorkspacePanel({
  workspace,
  uiText,
  canNavigateWorkspaces,
  canDeleteWorkspace,
  onGoPrev,
  onGoNext,
  onDeleteWorkspace,
  onAddCard,
  onAddProject,
  onUpdateTitle,
  onUpdateSubtitle,
  onUpdateCard,
  onDeleteCard,
  onReorderCards
}: WorkspacePanelProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const cancelDeleteButtonRef = useRef<HTMLButtonElement | null>(null);
  const deleteDialogTitleId = useId();
  const workspaceLabel = workspace.title.trim() || uiText.projectTitlePlaceholder;
  const hasWorkspaceTitle = workspace.title.trim().length > 0;

  useEffect(() => {
    if (!isDeleteDialogOpen) {
      return;
    }

    cancelDeleteButtonRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDeleteDialogOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isDeleteDialogOpen]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const dashboardElement = document.querySelector<HTMLElement>(".project-dashboard");

    if (!dashboardElement) {
      return;
    }

    dashboardElement.inert = isDeleteDialogOpen;

    return () => {
      dashboardElement.inert = false;
    };
  }, [isDeleteDialogOpen]);

  const handleConfirmDeleteWorkspace = () => {
    onDeleteWorkspace();
    setIsDeleteDialogOpen(false);
  };

  const deleteDialog = isDeleteDialogOpen ? (
    <div
      className="workspace-delete-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby={deleteDialogTitleId}
    >
      <h2
        id={deleteDialogTitleId}
        className="workspace-delete-dialog-title"
      >
        {uiText.deleteProjectDialogTitle}
      </h2>
      <p className="workspace-delete-dialog-copy">
        {hasWorkspaceTitle
          ? `${uiText.deleteProjectConfirmation} “${workspace.title.trim()}”?`
          : uiText.deleteUntitledProjectConfirmation}
      </p>
      <div className="workspace-delete-dialog-actions">
        <button
          ref={cancelDeleteButtonRef}
          type="button"
          className="workspace-delete-dialog-button workspace-delete-dialog-button-cancel"
          onClick={() => setIsDeleteDialogOpen(false)}
        >
          {uiText.cancel}
        </button>
        <button
          type="button"
          className="workspace-delete-dialog-button workspace-delete-dialog-button-confirm"
          onClick={handleConfirmDeleteWorkspace}
        >
          {uiText.deleteProject}
        </button>
      </div>
    </div>
  ) : null;

  return (
    <section className="dashboard-workspace-panel" data-theme={workspace.theme}>
      <div className="dashboard-shell dashboard-shell-workspace-panel">
        <div className="workspace-panel-stage">
          {canNavigateWorkspaces ? (
            <button
              type="button"
              className="workspace-nav workspace-nav-prev"
              onClick={onGoPrev}
              aria-label={uiText.previousWorkspace}
            >
              <span aria-hidden="true">‹</span>
            </button>
          ) : null}

          <div className="project-copy">
            <ProjectHeading
              title={workspace.title}
              description={workspace.subtitle}
              onTitleCommit={onUpdateTitle}
              onDescriptionCommit={onUpdateSubtitle}
              titlePlaceholder={uiText.projectTitlePlaceholder}
              descriptionPlaceholder={uiText.projectSubtitlePlaceholder}
            />

            <div className="workspace-actions">
              <button
                type="button"
                className="workspace-action-button workspace-action-button-card"
                onClick={onAddCard}
              >
                {uiText.addCard}
              </button>
              <button
                type="button"
                className="workspace-action-button workspace-action-button-project"
                onClick={onAddProject}
              >
                {uiText.addProject}
              </button>
            </div>
          </div>

          <div className="workspace-top-controls">
            {canDeleteWorkspace ? (
              <button
                type="button"
                className="workspace-project-delete"
                aria-label={`${uiText.deleteProject} ${workspaceLabel}`}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <TrashIcon size={23} />
              </button>
            ) : null}

            {canNavigateWorkspaces ? (
              <button
                type="button"
                className="workspace-nav workspace-nav-next"
                onClick={onGoNext}
                aria-label={uiText.nextWorkspace}
              >
                <span aria-hidden="true">›</span>
              </button>
            ) : null}
          </div>
        </div>

        <CardGrid
          workspaceId={workspace.id}
          cards={workspace.cards}
          uiText={uiText}
          onUpdateCard={onUpdateCard}
          onDeleteCard={onDeleteCard}
          onReorderCards={onReorderCards}
        />
      </div>

      {deleteDialog && typeof document !== "undefined"
        ? createPortal(deleteDialog, document.body)
        : null}
    </section>
  );
}

export default WorkspacePanel;
