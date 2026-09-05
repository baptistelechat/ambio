import {
  CELL_HEIGHT,
  CELL_WIDTH,
  GRID_GAP,
  widgetDefaults,
  type WidgetType,
} from "@/lib/types";
import { WidgetRenderer } from "@/widgets/WidgetRenderer";

const PREVIEW_BOX = 96;

export const WidgetPreview = ({ type }: { type: WidgetType }) => {
  const { cols, rows, settings } = widgetDefaults[type];
  const width = cols * CELL_WIDTH - GRID_GAP;
  const height = rows * CELL_HEIGHT - GRID_GAP;
  const scale = Math.min(PREVIEW_BOX / width, PREVIEW_BOX / height);

  return (
    <div
      className="relative overflow-hidden rounded-md bg-black"
      style={{ width: PREVIEW_BOX, height: PREVIEW_BOX }}
    >
      <div
        className="pointer-events-none absolute top-1/2 left-1/2"
        style={{
          width,
          height,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        <WidgetRenderer
          widget={{ id: "preview", type, col: 0, row: 0, settings }}
        />
      </div>
    </div>
  );
};
