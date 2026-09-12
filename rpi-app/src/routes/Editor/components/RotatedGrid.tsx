import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { Background } from "@/components/Background";
import { GridOverlay } from "@/components/GridOverlay";
import { getWidgetCols, gridToPixels, snapToGrid } from "@/lib/gridMath";
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  type Config,
  GRID_GAP,
  type Widget,
  widgetDefaults,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { WidgetRenderer } from "@/widgets/WidgetRenderer";

// ponytail: seuil en pixels ÉCRAN (pas en pixels canvas) avant de considérer
// qu'un pointerdown est un drag plutôt qu'un tap — un simple appui tactile
// bouge toujours de quelques px.
const DRAG_THRESHOLD_PX = 6;

interface DragState {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startLeft: number;
  startTop: number;
  moved: boolean;
}

const RotatedGridWidget = ({
  widget,
  scale,
  selected,
  onSelect,
  onMove,
}: {
  widget: Widget;
  scale: number;
  selected: boolean;
  onSelect: () => void;
  onMove: (col: number, row: number) => void;
}) => {
  const elRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const cols = getWidgetCols(widget);
  const { rows } = widgetDefaults[widget.type];
  const { left, top } = gridToPixels(widget.col, widget.row);
  const width = cols * CELL_WIDTH - GRID_GAP;
  const height = rows * CELL_HEIGHT - GRID_GAP;

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    // Un seul doigt actif à la fois — ignore un 2e pointeur pendant un drag.
    if (dragRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startLeft: left,
      startTop: top,
      moved: false,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;

    const screenDx = e.clientX - drag.startClientX;
    const screenDy = e.clientY - drag.startClientY;
    if (!drag.moved && Math.hypot(screenDx, screenDy) < DRAG_THRESHOLD_PX) {
      return;
    }
    drag.moved = true;

    // Le conteneur parent applique `rotate(90deg) scale(scale)` : le repère
    // écran du pointeur est tourné par rapport au repère local (left/top)
    // dans lequel on positionne le widget. Conversion via l'inverse de la
    // matrice de rotation à 90° (voir CLAUDE.md — pas de react-rnd ici, il
    // ne compense qu'un `scale`, jamais une rotation d'ancêtre).
    const localDx = screenDy / scale;
    const localDy = -screenDx / scale;

    if (elRef.current) {
      elRef.current.style.left = `${drag.startLeft + localDx}px`;
      elRef.current.style.top = `${drag.startTop + localDy}px`;
    }
  };

  const resetPosition = () => {
    if (elRef.current) {
      elRef.current.style.left = `${left}px`;
      elRef.current.style.top = `${top}px`;
    }
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    dragRef.current = null;

    if (!drag.moved) {
      onSelect();
      return;
    }

    const el = elRef.current;
    const curLeft = el ? Number.parseFloat(el.style.left) : left;
    const curTop = el ? Number.parseFloat(el.style.top) : top;
    const { col, row } = snapToGrid(curLeft, curTop, cols, rows);
    const snapped = gridToPixels(col, row);
    if (el) {
      el.style.left = `${snapped.left}px`;
      el.style.top = `${snapped.top}px`;
    }
    onMove(col, row);
  };

  const onPointerCancel = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    dragRef.current = null;
    resetPosition();
  };

  return (
    <div
      ref={elRef}
      className={cn(
        "absolute touch-none outline outline-transparent",
        selected && "outline-2 outline-white",
      )}
      style={{ left, top, width, height }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div className="pointer-events-none h-full w-full">
        <WidgetRenderer widget={widget} />
      </div>
    </div>
  );
};

interface RotatedGridProps {
  config: Config;
  scale: number;
  selectedWidgetId?: string | null;
  onSelectWidget: (id: string) => void;
  onMoveWidget: (id: string, col: number, row: number) => void;
  showGrid: boolean;
}

export const RotatedGrid = ({
  config,
  scale,
  selectedWidgetId,
  onSelectWidget,
  onMoveWidget,
  showGrid,
}: RotatedGridProps) => (
  <>
    <Background background={config.background} />
    {showGrid && <GridOverlay />}
    {config.widgets.map((widget) => (
      <RotatedGridWidget
        key={widget.id}
        widget={widget}
        scale={scale}
        selected={selectedWidgetId === widget.id}
        onSelect={() => onSelectWidget(widget.id)}
        onMove={(col, row) => onMoveWidget(widget.id, col, row)}
      />
    ))}
  </>
);
