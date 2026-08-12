// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import {
  clampTextLength,
  getRemainingInsertionLength,
  normalizeEditableValue,
  replaceSelectionWithText
} from "./contentEditable";

function createSelectionTarget(text: string) {
  const element = document.createElement("div");
  const textNode = document.createTextNode(text);
  element.appendChild(textNode);
  document.body.appendChild(element);
  return { element, textNode };
}

describe("contentEditable utilities", () => {
  it("normalizeEditableValue trims surrounding whitespace", () => {
    expect(normalizeEditableValue("  hello world  ")).toBe("hello world");
  });

  it("normalizeEditableValue returns an empty string for whitespace-only content", () => {
    expect(normalizeEditableValue("   ")).toBe("");
  });

  it("normalizeEditableValue applies maxLength after trimming", () => {
    expect(normalizeEditableValue("  hello world  ", 5)).toBe("hello");
  });

  it("normalizeEditableValue preserves internal newline characters", () => {
    expect(normalizeEditableValue("  hello\nworld  ")).toBe("hello\nworld");
  });

  it("clampTextLength leaves shorter text unchanged", () => {
    expect(clampTextLength("hello", 10)).toBe("hello");
  });

  it("clampTextLength truncates text that exceeds maxLength", () => {
    expect(clampTextLength("hello world", 5)).toBe("hello");
  });

  it("getRemainingInsertionLength accounts for selected text", () => {
    expect(getRemainingInsertionLength(10, 3, 12)).toBe(5);
  });

  it("getRemainingInsertionLength never returns less than zero", () => {
    expect(getRemainingInsertionLength(10, 0, 5)).toBe(0);
  });

  it("getRemainingInsertionLength allows one replacement character when selection frees space", () => {
    expect(getRemainingInsertionLength(10, 2, 9)).toBe(1);
  });

  it("replaceSelectionWithText inserts text and places the caret after it", () => {
    const { element, textNode } = createSelectionTarget("hello");
    const selection = window.getSelection();
    const range = document.createRange();

    range.setStart(textNode, 5);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);

    expect(replaceSelectionWithText("x")).toBe(true);
    expect(element.textContent).toBe("hellox");

    const nextRange = selection?.getRangeAt(0);
    expect(nextRange?.startContainer.nodeValue).toBe("x");
    expect(nextRange?.startOffset).toBe(1);
    expect(nextRange?.collapsed).toBe(true);

    replaceSelectionWithText("y");
    expect(element.textContent).toBe("helloxy");

    element.remove();
  });

  it("replaceSelectionWithText replaces selected text", () => {
    const { element, textNode } = createSelectionTarget("hello world");
    const selection = window.getSelection();
    const range = document.createRange();

    range.setStart(textNode, 5);
    range.setEnd(textNode, 11);
    selection?.removeAllRanges();
    selection?.addRange(range);

    expect(replaceSelectionWithText("!")).toBe(true);
    expect(element.textContent).toBe("hello!");

    element.remove();
  });
});
