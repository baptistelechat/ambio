import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  type WidgetCategory,
  widgetCategory,
  widgetLabels,
  type WidgetType,
} from "@/lib/types";
import { useEditorStore } from "@/store/editorStore";
import { WidgetPreview } from "@/routes/Editor/components/WidgetPreview";

const WIDGET_TYPES = Object.keys(widgetLabels) as WidgetType[];

const CATEGORY_TITLES: Record<WidgetCategory, string> = {
  classique: "Classique",
  wiggleui: "WiggleUI",
};

export const Palette = () => {
  const addWidget = useEditorStore((s) => s.addWidget);
  const uploadBackground = useEditorStore((s) => s.uploadBackground);
  const publish = useEditorStore((s) => s.publish);
  const status = useEditorStore((s) => s.status);
  const showGrid = useEditorStore((s) => s.showGrid);
  const setShowGrid = useEditorStore((s) => s.setShowGrid);

  return (
    <Card className="flex h-full w-72 shrink-0 flex-col">
      <CardHeader>
        <CardTitle>Widgets</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-grid">Afficher la grille</Label>
          <Switch
            id="show-grid"
            checked={showGrid}
            onCheckedChange={setShowGrid}
          />
        </div>

        <ScrollArea className="min-h-0 flex-1 -mx-1 px-1">
          <div className="flex flex-col gap-4 pr-3">
            {(["classique", "wiggleui"] as const).map((category) => (
              <div key={category} className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {CATEGORY_TITLES[category]}
                </p>
                <div className="flex flex-wrap gap-2">
                  {WIDGET_TYPES.filter(
                    (type) => widgetCategory[type] === category,
                  ).map((type) => (
                    <button
                      key={type}
                      type="button"
                      className="flex w-[104px] flex-col items-center gap-1 rounded-md p-1 text-center hover:bg-accent"
                      onClick={() => addWidget(type)}
                    >
                      <WidgetPreview type={type} />
                      <span className="text-xs leading-tight">
                        {widgetLabels[type]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator />

        <div className="flex flex-col gap-2">
          <Label htmlFor="background-upload">Fond (image ou vidéo)</Label>
          <Input
            id="background-upload"
            type="file"
            accept="image/*,video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadBackground(file);
            }}
          />
        </div>

        <Separator />

        <Button onClick={publish} disabled={status === "saving"}>
          {status === "saving" ? "Publication…" : "Publier"}
        </Button>
        {status === "saved" && (
          <span className="text-xs text-muted-foreground">Publié ✔</span>
        )}
        {status === "error" && (
          <span className="text-xs text-destructive">
            Erreur de publication
          </span>
        )}
      </CardContent>
    </Card>
  );
};
