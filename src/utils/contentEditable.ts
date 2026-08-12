export function normalizeEditableValue(rawValue: string, maxLength?: number) {
  const trimmedValue = rawValue.trim();

  if (!trimmedValue) {
    return "";
  }

  if (maxLength == null) {
    return trimmedValue;
  }

  return trimmedValue.slice(0, maxLength);
}

export function clampTextLength(text: string, maxLength?: number) {
  if (maxLength == null || text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength);
}

export function getRemainingInsertionLength(
  currentLength: number,
  selectionLength: number,
  maxLength: number
) {
  return Math.max(0, maxLength - (currentLength - selectionLength));
}

export function getSelectionLength(element: HTMLElement) {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return 0;
  }

  const range = selection.getRangeAt(0);

  if (!element.contains(range.commonAncestorContainer)) {
    return 0;
  }

  return selection.toString().length;
}

export function placeCaretAtEnd(element: HTMLElement) {
  const selection = window.getSelection();

  if (!selection) {
    return;
  }

  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function replaceSelectionWithText(text: string) {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return false;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(document.createTextNode(text));
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  return true;
}
