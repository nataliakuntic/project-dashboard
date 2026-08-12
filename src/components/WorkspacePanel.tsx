import type { KeyboardEvent, PointerEvent } from "react";
import {
  type TranslationSet
} from "../translations";
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
  const workspaceLabel = workspace.title.trim() || uiText.projectTitlePlaceholder;

  const handleWorkspaceDeletePointerDown = (
    event: PointerEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
  };

  const handleWorkspaceDeleteKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
  };

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

          <div className="project-copy" onPointerDown={(event) => event.stopPropagation()}>
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
                onClick={onDeleteWorkspace}
                onPointerDown={handleWorkspaceDeletePointerDown}
                onKeyDown={handleWorkspaceDeleteKeyDown}
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
    </section>
  );
}

export default WorkspacePanel;
