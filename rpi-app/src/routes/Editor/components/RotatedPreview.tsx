import { useFullscreenScale } from "@/hooks/useFullscreenScale";
import { RotatedGrid } from "@/routes/Editor/components/RotatedGrid";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/lib/types";
import { useEditorStore } from "@/store/editorStore";

export const RotatedPreview = () => {
  const config = useEditorStore((s) => s.config);
  const selectedWidgetId = useEditorStore((s) => s.selectedWidgetId);
  const select = useEditorStore((s) => s.select);
  const updateWidget = useEditorStore((s) => s.updateWidget);
  const showGrid = useEditorStore((s) => s.showGrid);
  // Dimensions inversées : le rendu pivoté remplit un écran mobile portrait
  // avec la hauteur de l'écran, plutôt que d'être limité par sa largeur.
  const scale = useFullscreenScale(CANVAS_HEIGHT, CANVAS_WIDTH);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
      <div
        className="relative shrink-0"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `rotate(90deg) scale(${scale})`,
        }}
      >
        <RotatedGrid
          config={config}
          scale={scale}
          selectedWidgetId={selectedWidgetId}
          onSelectWidget={select}
          onMoveWidget={(id, col, row) => updateWidget(id, { col, row })}
          showGrid={showGrid}
        />
      </div>
    </div>
  );
};
