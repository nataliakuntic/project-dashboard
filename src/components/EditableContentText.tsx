import {
  type MutableRefObject
} from "react";
import { useContentEditable } from "../hooks/useContentEditable";

export type EditableContentTextProps = {
  as: "h2" | "p";
  value: string;
  placeholder: string;
  onCommit: (nextValue: string) => void;
  className: string;
  ariaLabel: string;
  maxLength?: number;
  elementRef?: MutableRefObject<HTMLElement | null>;
};

function EditableContentText({
  as,
  value,
  placeholder,
  onCommit,
  className,
  ariaLabel,
  maxLength,
  elementRef
}: EditableContentTextProps) {
  const Element = as;
  const {
    elementRef: contentEditableRef,
    handleBlur,
    handleFocus,
    handleInput,
    handleKeyDown,
    handlePaste
  } = useContentEditable({
    value,
    placeholder,
    onCommit,
    maxLength,
    elementRef
  });

  return (
    <Element
      ref={contentEditableRef}
      className={className}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      role="textbox"
      aria-label={ariaLabel}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onInput={handleInput}
    >
      {value || placeholder}
    </Element>
  );
}

export default EditableContentText;
