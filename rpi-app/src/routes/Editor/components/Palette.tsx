import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_GRADIENT_PRESET,
  gradientPresets,
} from "@/lib/gradientPresets";
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

interface PaletteProps {
  // ponytail: le Drawer mobile fournit déjà son propre chrome (bordure,
  // arrondi) — inutile d'imbriquer une seconde Card dedans.
  bare?: boolean;
}

export const Palette = ({ bare = false }: PaletteProps) => {
  const addWidget = useEditorStore((s) => s.addWidget);
  const background = useEditorStore((s) => s.config.background);
  const setBackground = useEditorStore((s) => s.setBackground);
  const uploadBackground = useEditorStore((s) => s.uploadBackground);
  const publish = useEditorStore((s) => s.publish);
  const status = useEditorStore((s) => s.status);
  const showGrid = useEditorStore((s) => s.showGrid);
  const setShowGrid = useEditorStore((s) => s.setShowGrid);

  const Wrapper = bare ? "div" : Card;

  return (
    <Wrapper className="flex h-full w-full flex-col">
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

        <div className="flex flex-col gap-2">
          <Label htmlFor="background-gradient">Fond dégradé</Label>
          <Select
            value={
              background.type === "gradient"
                ? (background.gradientPreset ?? DEFAULT_GRADIENT_PRESET)
                : undefined
            }
            onValueChange={(value) =>
              setBackground({
                type: "gradient",
                url: "",
                gradientPreset: value,
              })
            }
          >
            <SelectTrigger id="background-gradient">
              <SelectValue placeholder="Choisir un dégradé" />
            </SelectTrigger>
            <SelectContent>
              {gradientPresets.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  <span className="flex items-center gap-2">
                    <span
                      className="size-4 shrink-0 rounded-full border border-black/10"
                      style={{
                        background: `linear-gradient(135deg, ${preset.color1}, ${preset.color2}, ${preset.color3})`,
                      }}
                    />
                    {preset.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
    </Wrapper>
  );
};
