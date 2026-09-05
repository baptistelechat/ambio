import { useEffect } from "react";
import { Canvas } from "@/routes/Editor/components/Canvas";
import { Palette } from "@/routes/Editor/components/Palette";
import { SettingsPanel } from "@/routes/Editor/components/SettingsPanel";
import { useEditorStore } from "@/store/editorStore";

export const Editor = () => {
  const load = useEditorStore((s) => s.load);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto flex h-screen max-w-6xl flex-col gap-4 overflow-hidden p-6">
      <h1 className="text-xl font-semibold">Éditeur d'écran de veille</h1>
      <div className="flex flex-1 items-start gap-4 overflow-hidden">
        <Canvas />
        <Palette />
      </div>
      <SettingsPanel />
    </div>
  );
};
