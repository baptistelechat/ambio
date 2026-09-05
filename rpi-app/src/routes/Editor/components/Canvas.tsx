import { useRef, type MouseEvent as ReactMouseEvent } from "react";
import { Rnd } from "react-rnd";
import { Background } from "@/components/Background";
import { useContainerScale } from "@/routes/Editor/hooks/useContainerScale";
import { useEditorStore } from "@/store/editorStore";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CELL_HEIGHT,
  CELL_WIDTH,
  GRID_COLS,
  GRID_GAP,
  GRID_PADDING,
  GRID_ROWS,
  type Widget,
  widgetDefaults,
} from "@/lib/types";
import { WidgetRenderer } from "@/widgets/WidgetRenderer";
import { cn } from "@/lib/utils";

const GridWidget = ({
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
  const rndRef = useRef<Rnd>(null);
  const draggedRef = useRef(false);
  const { cols, rows } = widgetDefaults[widget.type];

  return (
    <Rnd
      ref={rndRef}
      default={{
        x: GRID_PADDING + widget.col * CELL_WIDTH + GRID_GAP / 2,
        y: GRID_PADDING + widget.row * CELL_HEIGHT + GRID_GAP / 2,
        width: cols * CELL_WIDTH - GRID_GAP,
        height: rows * CELL_HEIGHT - GRID_GAP,
      }}
      scale={scale || 1}
      enableResizing={false}
      onClick={(e: ReactMouseEvent) => {
        e.stopPropagation();
        // Un drag termine toujours par un événement "click" natif — on
        // l'ignore pour ne pas ouvrir le panneau de réglages à chaque
        // relâchement du glisser-déposer.
        if (draggedRef.current) {
          draggedRef.current = false;
          return;
        }
        onSelect();
      }}
      onDrag={() => {
        draggedRef.current = true;
      }}
      onDragStop={(_e, d) => {
        const col = Math.min(
          Math.max(Math.round((d.x - GRID_PADDING) / CELL_WIDTH), 0),
          GRID_COLS - cols,
        );
        const row = Math.min(
          Math.max(Math.round((d.y - GRID_PADDING) / CELL_HEIGHT), 0),
          GRID_ROWS - rows,
        );
        // Le snap "live" de react-rnd (dragGrid) dérive facilement quand un
        // `scale` est appliqué au parent — on ignore sa position et on force
        // la case de grille calculée nous-mêmes via l'API impérative du ref,
        // sans passer par des props contrôlées (voir CLAUDE.md).
        rndRef.current?.updatePosition({
          x: GRID_PADDING + col * CELL_WIDTH + GRID_GAP / 2,
          y: GRID_PADDING + row * CELL_HEIGHT + GRID_GAP / 2,
        });
        onMove(col, row);
      }}
      className={cn(
        "outline outline-transparent",
        selected && "outline-2 outline-white",
      )}
    >
      <div className="pointer-events-none h-full w-full">
        <WidgetRenderer widget={widget} />
      </div>
    </Rnd>
  );
};

export const Canvas = () => {
  const { containerRef, scale } = useContainerScale(CANVAS_WIDTH);
  const config = useEditorStore((s) => s.config);
  const selectedWidgetId = useEditorStore((s) => s.selectedWidgetId);
  const select = useEditorStore((s) => s.select);
  const updateWidget = useEditorStore((s) => s.updateWidget);
  const showGrid = useEditorStore((s) => s.showGrid);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
      onClick={() => select(null)}
    >
      <div
        className="absolute top-0 left-0"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <Background background={config.background} />

        {showGrid && (
          <div
            className="pointer-events-none absolute"
            style={{
              inset: GRID_PADDING,
              // Traits à 3px (espace canvas non mis à l'échelle) pour rester
              // visibles une fois réduits par le `transform: scale()` du
              // conteneur — à 1px ils disparaissent en sous-pixel.
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.8) 3px, transparent 3px), linear-gradient(to bottom, rgba(255,255,255,0.8) 3px, transparent 3px)",
              backgroundSize: `${CELL_WIDTH}px ${CELL_HEIGHT}px`,
              // Le motif tuilé ne dessine un trait qu'au DÉBUT de chaque
              // cellule : la dernière colonne/ligne n'a donc jamais son trait
              // de droite/bas. On le complète avec un box-shadow interne.
              boxShadow:
                "inset -3px 0 0 rgba(255,255,255,0.8), inset 0 -3px 0 rgba(255,255,255,0.8)",
            }}
          />
        )}

        {config.widgets.map((widget) => (
          <GridWidget
            key={widget.id}
            widget={widget}
            scale={scale}
            selected={selectedWidgetId === widget.id}
            onSelect={() => select(widget.id)}
            onMove={(col, row) => updateWidget(widget.id, { col, row })}
          />
        ))}
      </div>
    </div>
  );
};
