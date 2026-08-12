import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import type { TranslationSet } from "../translations";
import type { Card } from "../features/dashboard/types";
import SortableCard from "./SortableCard";

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

    const oldIndex = cards.findIndex((card) => card.id === active.id);
    const newIndex = cards.findIndex((card) => card.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    onReorderCards(workspaceId, active.id as number, over.id as number);
  };

  return (
    <div onPointerDown={(event) => event.stopPropagation()}>
      <DndContext
        sensors={cardSensors}
        collisionDetection={closestCenter}
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
    </div>
  );
}

export default CardGrid;
