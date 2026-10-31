// A small inline icon set, 16 px on a 16 px box, drawn with currentColor.
// Add icons here, one name per meaning, so the app never mixes two icons
// for one idea.
const paths = {
  tray: "M2 9.5 4 3h8l2 6.5V13H2V9.5Zm0 0h4l1 1.5h2l1-1.5h4",
  star: "m8 2 1.8 3.8 4.2.5-3.1 2.9.8 4.1L8 11.3l-3.7 2 .8-4.1L2 6.3l4.2-.5L8 2Z",
  gear: "M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm5.5 2.5-.1-1 1.3-1.1-1.3-2.2-1.6.5a5 5 0 0 0-1.7-1L9.8 1.5H6.2l-.3 1.7a5 5 0 0 0-1.7 1l-1.6-.5L1.3 5.9 2.6 7l-.1 1 .1 1-1.3 1.1 1.3 2.2 1.6-.5a5 5 0 0 0 1.7 1l.3 1.7h3.6l.3-1.7a5 5 0 0 0 1.7-1l1.6.5 1.3-2.2L13.4 9l.1-1Z",
  plus: "M8 3v10M3 8h10",
  trash: "M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.5 8.5h6l.5-8.5",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, filled = false }: { name: IconName; filled?: boolean }) {
  return (
    <svg
      className="icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
