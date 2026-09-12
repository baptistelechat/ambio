import {
  CELL_HEIGHT,
  CELL_WIDTH,
  GRID_COLS,
  GRID_GAP,
  GRID_PADDING,
  GRID_ROWS,
} from "@/lib/types";

export const snapToGrid = (
  x: number,
  y: number,
  cols: number,
  rows: number,
) => {
  const col = Math.min(
    Math.max(Math.round((x - GRID_PADDING) / CELL_WIDTH), 0),
    GRID_COLS - cols,
  );
  const row = Math.min(
    Math.max(Math.round((y - GRID_PADDING) / CELL_HEIGHT), 0),
    GRID_ROWS - rows,
  );
  return { col, row };
};

export const gridToPixels = (col: number, row: number) => ({
  left: GRID_PADDING + col * CELL_WIDTH + GRID_GAP / 2,
  top: GRID_PADDING + row * CELL_HEIGHT + GRID_GAP / 2,
});
