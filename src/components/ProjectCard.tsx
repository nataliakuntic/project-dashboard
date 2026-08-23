import type { HTMLAttributes, Ref } from "react";
import EditableContentText from "./EditableContentText";
import TrashIcon from "./icons/TrashIcon";

export type ProjectCardProps = {
  title: string;
  subtitle: string;
  description: string;
  cardTitlePlaceholder: string;
  cardSubtitlePlaceholder: string;
  cardDescriptionPlaceholder: string;
  onTitleCommit: (nextValue: string) => void;
  onSubtitleCommit: (nextValue: string) => void;
  onDescriptionCommit: (nextValue: string) => void;
  onDelete: () => void;
  dragHandleProps: HTMLAttributes<HTMLButtonElement>;
  dragHandleRef?: Ref<HTMLButtonElement>;
};

function ProjectCard({
  title,
  subtitle,
  description,
  cardTitlePlaceholder,
  cardSubtitlePlaceholder,
  cardDescriptionPlaceholder,
  onTitleCommit,
  onSubtitleCommit,
  onDescriptionCommit,
  onDelete,
  dragHandleProps,
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
            ariaLabel="Edit card title"
            placeholder={cardTitlePlaceholder}
            multiline
          />
          <div className="project-card-header-actions">
            <button
              {...dragHandleProps}
              ref={dragHandleRef}
              type="button"
              className="card-drag-handle"
            >
              <span className="card-drag-handle-grip" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
            <button
              type="button"
              className="card-delete-button"
              aria-label={`Delete ${cardLabel}`}
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
          </div>
        </div>
        <EditableContentText
          as="p"
          className="project-card-subtitle"
          value={subtitle}
          onCommit={onSubtitleCommit}
          ariaLabel="Edit card subtitle"
          placeholder={cardSubtitlePlaceholder}
          multiline
        />
        <EditableContentText
          as="p"
          className="project-card-description"
          value={description}
          onCommit={onDescriptionCommit}
          ariaLabel="Edit card description"
          placeholder={cardDescriptionPlaceholder}
          multiline
        />
      </article>
    </div>
  );
}

export default ProjectCard;
