import { describe, expect, it } from "vitest";
import {
  clampTextLength,
  getRemainingInsertionLength,
  normalizeEditableValue
} from "./contentEditable";

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
});
