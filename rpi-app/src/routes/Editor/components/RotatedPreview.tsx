import { StaticGrid } from "@/components/StaticGrid";
import { useFullscreenScale } from "@/hooks/useFullscreenScale";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/lib/types";
import { useEditorStore } from "@/store/editorStore";

export const RotatedPreview = () => {
  const config = useEditorStore((s) => s.config);
  const selectedWidgetId = useEditorStore((s) => s.selectedWidgetId);
  const select = useEditorStore((s) => s.select);
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
        <StaticGrid
          config={config}
          selectedWidgetId={selectedWidgetId}
          onSelectWidget={select}
        />
      </div>
    </div>
  );
};
