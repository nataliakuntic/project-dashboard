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
  onDelete
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
          />
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
        <EditableContentText
          as="p"
          className="project-card-subtitle"
          value={subtitle}
          onCommit={onSubtitleCommit}
          ariaLabel="Edit card subtitle"
          placeholder={cardSubtitlePlaceholder}
        />
        <EditableContentText
          as="p"
          className="project-card-description"
          value={description}
          onCommit={onDescriptionCommit}
          ariaLabel="Edit card description"
          placeholder={cardDescriptionPlaceholder}
        />
      </article>
    </div>
  );
}

export default ProjectCard;
