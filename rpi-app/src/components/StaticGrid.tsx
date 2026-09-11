import { Background } from "@/components/Background";
import { cn } from "@/lib/utils";
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  type Config,
  GRID_GAP,
  GRID_PADDING,
  widgetDefaults,
} from "@/lib/types";
import { WidgetRenderer } from "@/widgets/WidgetRenderer";

interface StaticGridProps {
  config: Config;
  selectedWidgetId?: string | null;
  onSelectWidget?: (id: string) => void;
}

export const StaticGrid = ({
  config,
  selectedWidgetId,
  onSelectWidget,
}: StaticGridProps) => (
  <>
    <Background background={config.background} />
    {config.widgets.map((widget) => {
      const { cols, rows } = widgetDefaults[widget.type];
      return (
        <div
          key={widget.id}
          className={cn(
            "absolute outline outline-transparent",
            onSelectWidget && "cursor-pointer",
            selectedWidgetId === widget.id && "outline-2 outline-white",
          )}
          style={{
            left: GRID_PADDING + widget.col * CELL_WIDTH + GRID_GAP / 2,
            top: GRID_PADDING + widget.row * CELL_HEIGHT + GRID_GAP / 2,
            width: cols * CELL_WIDTH - GRID_GAP,
            height: rows * CELL_HEIGHT - GRID_GAP,
          }}
          onClick={onSelectWidget ? () => onSelectWidget(widget.id) : undefined}
        >
          <WidgetRenderer widget={widget} />
        </div>
      );
    })}
  </>
);
