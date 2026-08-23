type DragHandleIconProps = {
  size?: number;
};

function DragHandleIcon({ size = 17 }: DragHandleIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 11.5V9.3a1.8 1.8 0 0 1 3.6 0v2" />
      <path d="M12.1 11.2V7.7a1.8 1.8 0 0 1 3.6 0v4.2" />
      <path d="M15.7 11.6v-1.4a1.7 1.7 0 1 1 3.4 0v4.3c0 3-2.2 5.5-5 5.5h-3.3a4.7 4.7 0 0 1-3.7-1.8l-2.2-2.8a1.6 1.6 0 0 1 2.5-2l1.1 1.3V6.8a1.8 1.8 0 1 1 3.6 0v4.4" />
    </svg>
  );
}

export default DragHandleIcon;
