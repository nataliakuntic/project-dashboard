import {
  KeyboardSensor,
  PointerActivationConstraints,
  PointerSensor
} from "@dnd-kit/dom";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import type { TranslationSet } from "../translations";
import type { Card } from "../features/dashboard/types";
import useIsMobileViewport from "../hooks/useIsMobileViewport";
import SortableCard from "./SortableCard";

const CARD_SENSORS = [
  PointerSensor.configure({
    activationConstraints: [
      new PointerActivationConstraints.Distance({
        value: 8
      })
    ]
  }),
  KeyboardSensor
];

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

  const handleCardDragEnd = ({ canceled, operation }: DragEndEvent) => {
    const { source } = operation;

    if (canceled || !source || !isSortable(source)) {
      return;
    }

    if (typeof source.id !== "number" || source.initialIndex === source.index) {
      return;
    }

    const destinationCard = cards[source.index];

    if (!destinationCard || typeof destinationCard.id !== "number") {
      return;
    }

    onReorderCards(workspaceId, source.id, destinationCard.id);
  };

  return (
    <DragDropProvider sensors={CARD_SENSORS} onDragEnd={handleCardDragEnd}>
      <div className="project-card-grid">
        {cards.map((card, index) => (
          <SortableCard
            key={card.id}
            card={card}
            index={index}
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
    </DragDropProvider>
  );
}

export default CardGrid;
