import type { MouseEvent as ReactMouseEvent } from "react";
import { Rnd } from "react-rnd";
import { Background } from "@/components/Background";
import { useContainerScale } from "@/routes/Editor/hooks/useContainerScale";
import { useEditorStore } from "@/store/editorStore";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/lib/types";
import { WidgetRenderer } from "@/widgets/WidgetRenderer";
import { cn } from "@/lib/utils";

export const Canvas = () => {
  const { containerRef, scale } = useContainerScale(CANVAS_WIDTH);
  const config = useEditorStore((s) => s.config);
  const selectedWidgetId = useEditorStore((s) => s.selectedWidgetId);
  const select = useEditorStore((s) => s.select);
  const updateWidget = useEditorStore((s) => s.updateWidget);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-lg border bg-black"
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

        {config.widgets.map((widget) => (
          <Rnd
            key={widget.id}
            default={{
              x: widget.x,
              y: widget.y,
              width: widget.width,
              height: widget.height,
            }}
            scale={scale || 1}
            onClick={(e: ReactMouseEvent) => {
              e.stopPropagation();
              select(widget.id);
            }}
            onDragStop={(_e, d) =>
              updateWidget(widget.id, {
                x: Math.round(d.x),
                y: Math.round(d.y),
              })
            }
            onResizeStop={(_e, _dir, ref, _delta, position) =>
              updateWidget(widget.id, {
                width: Number.parseInt(ref.style.width, 10),
                height: Number.parseInt(ref.style.height, 10),
                x: Math.round(position.x),
                y: Math.round(position.y),
              })
            }
            className={cn(
              "outline outline-transparent",
              selectedWidgetId === widget.id && "outline-2 outline-white",
            )}
          >
            <div className="pointer-events-none h-full w-full">
              <WidgetRenderer widget={widget} />
            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
};
