import { useEffect, useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Canvas } from "@/routes/Editor/components/Canvas";
import { Palette } from "@/routes/Editor/components/Palette";
import { RotatedPreview } from "@/routes/Editor/components/RotatedPreview";
import { SettingsPanel } from "@/routes/Editor/components/SettingsPanel";
import { useEditorStore } from "@/store/editorStore";

// ponytail: fractions de hauteur d'écran pour le tiroir vaul — 0.08 ne
// montre que la poignée (aperçu plein écran derrière). OPEN_SNAP est à 1
// (plein écran) et pas à 0.9 comme on pourrait s'y attendre : le contenu
// fixe du tiroir (titre, onglets, séparateur, bouton Publier — tout ce qui
// n'est PAS dans une ScrollArea) dépasse la portion masquée par un snap à
// 90%, ce qui poussait "Publier" en dehors de la zone visible en
// permanence, peu importe le contenu scrollable à l'intérieur.
const PEEK_SNAP = 0.08;
const OPEN_SNAP = 1;

export const Editor = () => {
  const load = useEditorStore((s) => s.load);
  const isMobile = useIsMobile();
  const [snap, setSnap] = useState<number | string | null>(PEEK_SNAP);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      {/* Mobile : aperçu pivoté plein écran + tiroir de widgets qu'on swipe */}
      <div className="fixed inset-0 md:hidden" data-vaul-drawer-wrapper="">
        <RotatedPreview />
      </div>
      {isMobile && (
        <Drawer
          open
          dismissible={false}
          modal={false}
          snapPoints={[PEEK_SNAP, OPEN_SNAP]}
          activeSnapPoint={snap}
          setActiveSnapPoint={setSnap}
        >
          <DrawerContent>
            <Palette bare />
          </DrawerContent>
        </Drawer>
      )}

      {/* Desktop : édition classique côte à côte, drag de position inclus */}
      <div className="mx-auto hidden h-dvh max-w-6xl flex-col gap-4 p-6 md:flex md:overflow-hidden">
        <h1 className="text-xl font-semibold">Éditeur d'écran de veille</h1>
        <div className="flex flex-1 items-start gap-4 overflow-hidden">
          <Canvas />
          <div className="flex h-full w-72 shrink-0">
            <Palette />
          </div>
        </div>
      </div>

      <SettingsPanel />
    </>
  );
};
