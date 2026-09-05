import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { widgetLabels, type WidgetType } from "@/lib/types";
import { useEditorStore } from "@/store/editorStore";

const WIDGET_TYPES = Object.keys(widgetLabels) as WidgetType[];

export const Palette = () => {
  const addWidget = useEditorStore((s) => s.addWidget);
  const uploadBackground = useEditorStore((s) => s.uploadBackground);
  const publish = useEditorStore((s) => s.publish);
  const status = useEditorStore((s) => s.status);

  return (
    <Card className="w-72 shrink-0">
      <CardHeader>
        <CardTitle>Widgets</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {WIDGET_TYPES.map((type) => (
            <Button
              key={type}
              variant="secondary"
              size="sm"
              onClick={() => addWidget(type)}
            >
              + {widgetLabels[type]}
            </Button>
          ))}
        </div>

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
