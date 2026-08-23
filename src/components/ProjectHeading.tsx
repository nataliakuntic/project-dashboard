import { type PointerEvent, useRef } from "react";
import { placeCaretAtEnd } from "../utils/contentEditable";
import EditableContentText from "./EditableContentText";

const PROJECT_TITLE_MAX_LENGTH = 28;

type ProjectHeadingProps = {
  title: string;
  subtitle: string;
  titlePlaceholder: string;
  subtitlePlaceholder: string;
  editTitleLabel: string;
  editSubtitleLabel: string;
  onTitleCommit: (nextValue: string) => void;
  onSubtitleCommit: (nextValue: string) => void;
};

type EditableProjectFieldProps = {
  as: "h2" | "p";
  value: string;
  placeholder: string;
  onCommit: (nextValue: string) => void;
  hitAreaClassName: string;
  editableClassName: string;
  ariaLabel: string;
  maxLength?: number;
};

function AnimatedDashUnderline() {
  return (
    <div className="animated-dash-underline" aria-hidden="true">
      {Array.from({ length: 7 }).map((_, index) => (
        <span
          key={index}
          className="animated-dash"
          style={{ ["--dash-index" as string]: index }}
        />
      ))}
    </div>
  );
}

function EditableProjectField({
  as,
  value,
  placeholder,
  onCommit,
  hitAreaClassName,
  editableClassName,
  ariaLabel,
  maxLength
}: EditableProjectFieldProps) {
  const elementRef = useRef<HTMLElement | null>(null);

  const handleHitAreaPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !elementRef.current) {
      return;
    }

    event.preventDefault();
    elementRef.current.focus();
    placeCaretAtEnd(elementRef.current);
  };

  return (
    <div className={hitAreaClassName} onPointerDown={handleHitAreaPointerDown}>
      <EditableContentText
        as={as}
        value={value}
        onCommit={onCommit}
        placeholder={placeholder}
        className={editableClassName}
        ariaLabel={ariaLabel}
        maxLength={maxLength}
        elementRef={elementRef}
      />
    </div>
  );
}

function ProjectHeading({
  title,
  subtitle,
  titlePlaceholder,
  subtitlePlaceholder,
  editTitleLabel,
  editSubtitleLabel,
  onTitleCommit,
  onSubtitleCommit
}: ProjectHeadingProps) {
  const hasCustomTitle = title.trim().length > 0;

  return (
    <div
      className={`project-heading ${
        hasCustomTitle
          ? "project-heading--custom"
          : "project-heading--placeholder"
      }`}
    >
      <EditableProjectField
        as="h2"
        value={title}
        onCommit={onTitleCommit}
        placeholder={titlePlaceholder}
        hitAreaClassName="project-title-hit-area"
        editableClassName="project-title"
        ariaLabel={editTitleLabel}
        maxLength={PROJECT_TITLE_MAX_LENGTH}
      />
      <div className="project-underline-slot" aria-hidden="true">
        {!hasCustomTitle && <AnimatedDashUnderline />}
      </div>
      <EditableProjectField
        as="p"
        value={subtitle}
        onCommit={onSubtitleCommit}
        placeholder={subtitlePlaceholder}
        hitAreaClassName="project-description-hit-area"
        editableClassName="project-description"
        ariaLabel={editSubtitleLabel}
      />
    </div>
  );
}

export default ProjectHeading;
