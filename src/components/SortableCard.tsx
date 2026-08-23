import { type TransitionEvent, useRef, useState } from "react";
import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { closestCenter } from "@dnd-kit/collision";
import { useSortable } from "@dnd-kit/react/sortable";
import type { TranslationSet } from "../translations";
import type { Card } from "../features/dashboard/types";
import ProjectCard from "./ProjectCard";

type SortableCardProps = {
  card: Card;
  index: number;
  isMobileViewport: boolean;
  uiText: TranslationSet;
  onTitleCommit: (nextValue: string) => void;
  onSubtitleCommit: (nextValue: string) => void;
  onDescriptionCommit: (nextValue: string) => void;
  onDelete: () => void;
};

function SortableCard({
  card,
  index,
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
    ref,
    handleRef,
    isDragging
  } = useSortable({
    id: card.id,
    collisionDetector: closestCenter,
    disabled: {
      draggable: isDeleting
    },
    index,
    modifiers: isMobileViewport ? [RestrictToVerticalAxis] : undefined
  });

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
      ref={ref}
      className={`sortable-card${isDragging ? " is-dragging" : ""}`}
    >
      <div
        className={`sortable-card-visual${isDeleting ? " is-deleting" : ""}`}
        onTransitionEnd={handleDeleteTransitionEnd}
      >
        <div
          className="sortable-card-activator"
          ref={!isMobileViewport ? handleRef : undefined}
        >
          <ProjectCard
            title={card.title}
            subtitle={card.subtitle}
            description={card.description}
            cardTitlePlaceholder={uiText.cardTitlePlaceholder}
            cardSubtitlePlaceholder={uiText.cardSubtitlePlaceholder}
            cardDescriptionPlaceholder={uiText.cardDescriptionPlaceholder}
            editCardTitleLabel={uiText.editCardTitle}
            editCardSubtitleLabel={uiText.editCardSubtitle}
            editCardDescriptionLabel={uiText.editCardDescription}
            deleteCardLabel={uiText.deleteCard}
            onTitleCommit={onTitleCommit}
            onSubtitleCommit={onSubtitleCommit}
            onDescriptionCommit={onDescriptionCommit}
            onDelete={handleDeleteRequest}
            dragHandleAriaLabel={uiText.moveCard}
            dragHandleRef={isMobileViewport ? handleRef : undefined}
          />
        </div>
      </div>
    </div>
  );
}

export default SortableCard;
