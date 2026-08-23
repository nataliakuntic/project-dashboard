import type { Ref } from "react";
import EditableContentText from "./EditableContentText";
import DragHandleIcon from "./icons/DragHandleIcon";
import TrashIcon from "./icons/TrashIcon";

export type ProjectCardProps = {
  title: string;
  subtitle: string;
  description: string;
  cardTitlePlaceholder: string;
  cardSubtitlePlaceholder: string;
  cardDescriptionPlaceholder: string;
  editCardTitleLabel: string;
  editCardSubtitleLabel: string;
  editCardDescriptionLabel: string;
  deleteCardLabel: string;
  onTitleCommit: (nextValue: string) => void;
  onSubtitleCommit: (nextValue: string) => void;
  onDescriptionCommit: (nextValue: string) => void;
  onDelete: () => void;
  dragHandleAriaLabel: string;
  dragHandleRef?: Ref<HTMLButtonElement>;
};

function ProjectCard({
  title,
  subtitle,
  description,
  cardTitlePlaceholder,
  cardSubtitlePlaceholder,
  cardDescriptionPlaceholder,
  editCardTitleLabel,
  editCardSubtitleLabel,
  editCardDescriptionLabel,
  deleteCardLabel,
  onTitleCommit,
  onSubtitleCommit,
  onDescriptionCommit,
  onDelete,
  dragHandleAriaLabel,
  dragHandleRef
}: ProjectCardProps) {
  const cardLabel = title.trim() || cardTitlePlaceholder;

  return (
    <div className="project-card-container">
      <article className="project-card-content">
        <div className="project-card-header">
          <EditableContentText
            as="h2"
            className="project-card-title"
            value={title}
            onCommit={onTitleCommit}
            ariaLabel={editCardTitleLabel}
            placeholder={cardTitlePlaceholder}
            multiline
          />
        </div>
        <EditableContentText
          as="p"
          className="project-card-subtitle"
          value={subtitle}
          onCommit={onSubtitleCommit}
          ariaLabel={editCardSubtitleLabel}
          placeholder={cardSubtitlePlaceholder}
          multiline
        />
        <EditableContentText
          as="p"
          className="project-card-description"
          value={description}
          onCommit={onDescriptionCommit}
          ariaLabel={editCardDescriptionLabel}
          placeholder={cardDescriptionPlaceholder}
          multiline
        />
        <div className="project-card-header-actions">
          <button
            type="button"
            className="card-delete-button"
            aria-label={`${deleteCardLabel} ${cardLabel}`}
            onClick={onDelete}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onKeyDown={(event) => {
              event.stopPropagation();
            }}
          >
            <TrashIcon />
          </button>
          <button
            ref={dragHandleRef}
            type="button"
            className="card-drag-handle"
            aria-label={dragHandleAriaLabel}
          >
            <DragHandleIcon />
          </button>
        </div>
      </article>
    </div>
  );
}

export default ProjectCard;
