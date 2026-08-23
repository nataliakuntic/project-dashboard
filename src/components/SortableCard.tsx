import { type HTMLAttributes, type TransitionEvent, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TranslationSet } from "../translations";
import type { Card } from "../features/dashboard/types";
import ProjectCard from "./ProjectCard";

type SortableCardProps = {
  card: Card;
  isMobileViewport: boolean;
  uiText: TranslationSet;
  onTitleCommit: (nextValue: string) => void;
  onSubtitleCommit: (nextValue: string) => void;
  onDescriptionCommit: (nextValue: string) => void;
  onDelete: () => void;
};

function SortableCard({
  card,
  isMobileViewport,
  uiText,
  onTitleCommit,
  onSubtitleCommit,
  onDescriptionCommit,
  onDelete
}: SortableCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const hasCompletedDeleteRef = useRef(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const desktopActivatorProps =
    !isDeleting && !isMobileViewport
      ? {
          ref: setActivatorNodeRef,
          ...attributes,
          ...listeners
        }
      : {};

  const mobileHandleProps: HTMLAttributes<HTMLButtonElement> = {
    "aria-label": uiText.moveCard,
    ...(!isDeleting && isMobileViewport ? { ...attributes, ...listeners } : {})
  };

  const completeDelete = () => {
    if (hasCompletedDeleteRef.current) {
      return;
    }

    hasCompletedDeleteRef.current = true;
    onDelete();
  };

  const handleDeleteRequest = () => {
    if (isDeleting) {
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      completeDelete();
      return;
    }

    setIsDeleting(true);
  };

  const handleDeleteTransitionEnd = (
    event: TransitionEvent<HTMLDivElement>
  ) => {
    if (
      !isDeleting ||
      event.target !== event.currentTarget ||
      event.propertyName !== "opacity"
    ) {
      return;
    }

    completeDelete();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-card${isDragging ? " is-dragging" : ""}`}
    >
      <div
        className={`sortable-card-visual${isDeleting ? " is-deleting" : ""}`}
        onTransitionEnd={handleDeleteTransitionEnd}
      >
        <div
          className="sortable-card-activator"
          {...desktopActivatorProps}
        >
          <ProjectCard
            title={card.title}
            subtitle={card.subtitle}
            description={card.description}
            cardTitlePlaceholder={uiText.cardTitlePlaceholder}
            cardSubtitlePlaceholder={uiText.cardSubtitlePlaceholder}
            cardDescriptionPlaceholder={uiText.cardDescriptionPlaceholder}
            onTitleCommit={onTitleCommit}
            onSubtitleCommit={onSubtitleCommit}
            onDescriptionCommit={onDescriptionCommit}
            onDelete={handleDeleteRequest}
            dragHandleProps={mobileHandleProps}
            dragHandleRef={isDeleting || !isMobileViewport ? undefined : setActivatorNodeRef}
          />
        </div>
      </div>
    </div>
  );
}

export default SortableCard;
