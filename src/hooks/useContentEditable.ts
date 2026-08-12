import {
  type ClipboardEvent,
  type FocusEvent,
  type FormEvent,
  type KeyboardEvent,
  type MutableRefObject,
  useEffect,
  useRef
} from "react";
import {
  clampTextLength,
  getRemainingInsertionLength,
  getSelectionLength,
  normalizeEditableValue,
  placeCaretAtEnd,
  replaceSelectionWithText
} from "../utils/contentEditable";

type UseContentEditableParams = {
  value: string;
  placeholder: string;
  onCommit: (nextValue: string) => void;
  multiline?: boolean;
  maxLength?: number;
  elementRef?: MutableRefObject<HTMLElement | null>;
};

export function useContentEditable({
  value,
  placeholder,
  onCommit,
  multiline = false,
  maxLength,
  elementRef
}: UseContentEditableParams) {
  const internalElementRef = useRef<HTMLElement | null>(null);
  const previousValueRef = useRef(value);
  const resolvedElementRef = elementRef ?? internalElementRef;

  useEffect(() => {
    if (!resolvedElementRef.current) {
      return;
    }

    const nextDisplayValue =
      value || document.activeElement === resolvedElementRef.current ? value : placeholder;

    if (resolvedElementRef.current.textContent !== nextDisplayValue) {
      resolvedElementRef.current.textContent = nextDisplayValue;
    }
  }, [placeholder, resolvedElementRef, value]);

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const nextValue = normalizeEditableValue(
      event.currentTarget.textContent || "",
      maxLength
    );
    onCommit(nextValue);
    previousValueRef.current = nextValue;

    const nextDisplayValue = nextValue || placeholder;

    if (event.currentTarget.textContent !== nextDisplayValue) {
      event.currentTarget.textContent = nextDisplayValue;
    }
  };

  const handleFocus = (event: FocusEvent<HTMLElement>) => {
    previousValueRef.current = value;

    if (!value) {
      event.currentTarget.textContent = "";
    }

    placeCaretAtEnd(event.currentTarget);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    event.stopPropagation();

    if (event.key === "Escape") {
      event.preventDefault();
      event.currentTarget.textContent = previousValueRef.current;
      event.currentTarget.blur();
      return;
    }

    if (!multiline && event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
      return;
    }

    if (
      maxLength != null &&
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      const currentLength = event.currentTarget.textContent?.length || 0;
      const selectionLength = getSelectionLength(event.currentTarget);
      const nextLength = currentLength - selectionLength;

      if (nextLength >= maxLength) {
        event.preventDefault();
      }
    }
  };

  const handleInput = (event: FormEvent<HTMLElement>) => {
    if (maxLength == null) {
      return;
    }

    const currentText = event.currentTarget.textContent || "";
    const clampedText = clampTextLength(currentText, maxLength);

    if (currentText.length > maxLength) {
      event.currentTarget.textContent = clampedText;
      placeCaretAtEnd(event.currentTarget);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLElement>) => {
    if (maxLength == null) {
      return;
    }

    event.preventDefault();

    const currentText = event.currentTarget.textContent || "";
    const selectionLength = getSelectionLength(event.currentTarget);
    const availableLength = getRemainingInsertionLength(
      currentText.length,
      selectionLength,
      maxLength
    );
    const pastedText = event.clipboardData
      .getData("text/plain")
      .slice(0, availableLength);

    if (!pastedText) {
      return;
    }

    replaceSelectionWithText(pastedText);
  };

  const setElementRef = (node: HTMLElement | null) => {
    resolvedElementRef.current = node;
  };

  return {
    elementRef: setElementRef,
    handleBlur,
    handleFocus,
    handleInput,
    handleKeyDown,
    handlePaste
  };
}
