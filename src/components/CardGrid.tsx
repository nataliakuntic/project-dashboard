import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type Modifier
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import type { TranslationSet } from "../translations";
import type { Card } from "../features/dashboard/types";
import useIsMobileViewport from "../hooks/useIsMobileViewport";
import SortableCard from "./SortableCard";

const restrictToVerticalAxis: Modifier = ({ transform }) => ({
  ...transform,
  x: 0
});

type CardGridProps = {
  workspaceId: number;
  cards: Card[];
  uiText: TranslationSet;
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

function CardGrid({
  workspaceId,
  cards,
  uiText,
  onUpdateCard,
  onDeleteCard,
  onReorderCards
}: CardGridProps) {
  const isMobileViewport = useIsMobileViewport();
  const cardSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleCardDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }

    if (typeof active.id !== "number" || typeof over.id !== "number") {
      return;
    }

    onReorderCards(workspaceId, active.id, over.id);
  };

  return (
    <DndContext
      sensors={cardSensors}
      collisionDetection={closestCenter}
      modifiers={isMobileViewport ? [restrictToVerticalAxis] : undefined}
      onDragEnd={handleCardDragEnd}
    >
      <SortableContext
        items={cards.map((card) => card.id)}
        strategy={rectSortingStrategy}
      >
        <div className="project-card-grid" aria-live="polite">
          {cards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              isMobileViewport={isMobileViewport}
              uiText={uiText}
              onTitleCommit={(nextValue) =>
                onUpdateCard(card.id, "title", nextValue)
              }
              onSubtitleCommit={(nextValue) =>
                onUpdateCard(card.id, "subtitle", nextValue)
              }
              onDescriptionCommit={(nextValue) =>
                onUpdateCard(card.id, "description", nextValue)
              }
              onDelete={() => onDeleteCard(card.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default CardGrid;
