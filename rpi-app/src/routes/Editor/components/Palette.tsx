import {
  Grid3x3Icon,
  ImageIcon,
  LayoutGridIcon,
  PaletteIcon,
  SettingsIcon,
  SparklesIcon,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DEFAULT_GRADIENT_PRESET,
  gradientPresets,
} from "@/lib/gradientPresets";
import {
  type WidgetCategory,
  widgetCategory,
  widgetLabels,
  type WidgetType,
  WIGGLE_SUBCATEGORY_ORDER,
  wiggleSubcategory,
  wiggleSubcategoryLabels,
} from "@/lib/types";
import { useEditorStore } from "@/store/editorStore";
import { WidgetPreview } from "@/routes/Editor/components/WidgetPreview";

const WIDGET_TYPES = Object.keys(widgetLabels) as WidgetType[];

const CATEGORY_TITLES: Record<WidgetCategory, string> = {
  classique: "Classique",
  wiggleui: "WiggleUI",
};

const CATEGORY_ICONS: Record<WidgetCategory, typeof LayoutGridIcon> = {
  classique: LayoutGridIcon,
  wiggleui: SparklesIcon,
};

const WidgetButtonGrid = ({
  types,
  onSelect,
}: {
  types: WidgetType[];
  onSelect: (type: WidgetType) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {types.map((type) => (
      <button
        key={type}
        type="button"
        className="flex w-[104px] flex-col items-center gap-1 rounded-md p-1 text-center hover:bg-accent"
        onClick={() => onSelect(type)}
      >
        <WidgetPreview type={type} />
        <span className="text-xs leading-tight">{widgetLabels[type]}</span>
      </button>
    ))}
  </div>
);

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
    // ponytail: `min-h-0 flex-1` plutôt que `h-full` — ce wrapper est un
    // flex item du DrawerContent (aux côtés de la poignée) en mode `bare`,
    // et un `height:100%` y ignorerait l'espace déjà pris par la poignée,
    // débordant d'autant. `flex-1` occupe correctement l'espace restant
    // dans les deux contextes (mobile bare et desktop, où c'est l'unique
    // enfant du conteneur).
    <Wrapper className="flex w-full min-h-0 flex-1 flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="size-4" />
          Réglages
        </CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
        {/* ponytail: onglets plutôt qu'un long scroll unique — évite le
            double-scroll imbriqué (ScrollArea dans ScrollArea) et garde le
            bouton Publier toujours visible, hors des onglets. */}
        <Tabs
          defaultValue="widget"
          className="flex min-h-0 flex-1 flex-col gap-4"
        >
          <TabsList className="w-full">
            <TabsTrigger value="widget">
              <LayoutGridIcon />
              Widget
            </TabsTrigger>
            <TabsTrigger value="fond">
              <ImageIcon />
              Fond
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="widget"
            className="flex min-h-0 flex-1 flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <Label htmlFor="show-grid" className="flex items-center gap-2">
                <Grid3x3Icon className="size-4" />
                Afficher la grille
              </Label>
              <Switch
                id="show-grid"
                checked={showGrid}
                onCheckedChange={setShowGrid}
              />
            </div>

            <ScrollArea className="min-h-0 flex-1 -mx-1 px-1">
              <div className="flex flex-col gap-4 pr-3">
                {(["classique", "wiggleui"] as const).map((category) => {
                  const CategoryIcon = CATEGORY_ICONS[category];
                  const typesInCategory = WIDGET_TYPES.filter(
                    (type) => widgetCategory[type] === category,
                  );
                  return (
                    <div key={category} className="flex flex-col gap-3">
                      <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <CategoryIcon className="size-4" />
                        {CATEGORY_TITLES[category]}
                      </p>
                      {category === "wiggleui" ? (
                        // Sous-groupée par thème (horloges, météo, qualité de
                        // l'air…) — trop de widgets pour rester lisible en
                        // une seule liste plate.
                        WIGGLE_SUBCATEGORY_ORDER.map((subcategory) => {
                          const types = typesInCategory.filter(
                            (type) => wiggleSubcategory[type] === subcategory,
                          );
                          if (types.length === 0) return null;
                          return (
                            <div
                              key={subcategory}
                              className="flex flex-col gap-2"
                            >
                              <p className="pl-1 text-xs font-medium text-muted-foreground/70">
                                {wiggleSubcategoryLabels[subcategory]}
                              </p>
                              <WidgetButtonGrid
                                types={types}
                                onSelect={addWidget}
                              />
                            </div>
                          );
                        })
                      ) : (
                        <WidgetButtonGrid
                          types={typesInCategory}
                          onSelect={addWidget}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent
            value="fond"
            className="flex min-h-0 flex-1 flex-col gap-4"
          >
            <ScrollArea className="min-h-0 flex-1 -mx-1 px-1">
              <div className="flex flex-col gap-4 pr-3">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="background-upload"
                    className="flex items-center gap-2"
                  >
                    <ImageIcon className="size-4" />
                    Fond (image ou vidéo)
                  </Label>
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
                  <Label
                    htmlFor="background-gradient"
                    className="flex items-center gap-2"
                  >
                    <PaletteIcon className="size-4" />
                    Fond dégradé
                  </Label>
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
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

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
