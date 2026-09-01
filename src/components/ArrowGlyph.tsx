import type { ArrowDir } from "../types";

const PATHS: Record<ArrowDir, string> = {
  up: "M12 4 20 20 H4 Z",
  down: "M12 20 20 4 H4 Z",
  left: "M4 12 20 4 V20 Z",
  right: "M20 12 4 4 V20 Z",
};

export function ArrowGlyph({
  dir,
  size = 14,
}: {
  dir: ArrowDir;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <path d={PATHS[dir]} fill="currentColor" />
    </svg>
  );
}
