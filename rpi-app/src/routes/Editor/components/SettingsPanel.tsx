import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { widgetLabels } from "@/lib/types";
import { useEditorStore } from "@/store/editorStore";

export const SettingsPanel = () => {
  const selectedWidgetId = useEditorStore((s) => s.selectedWidgetId);
  const widget = useEditorStore((s) =>
    s.config.widgets.find((w) => w.id === selectedWidgetId),
  );
  const select = useEditorStore((s) => s.select);
  const updateWidgetSettings = useEditorStore((s) => s.updateWidgetSettings);
  const removeWidget = useEditorStore((s) => s.removeWidget);

  return (
    <Sheet open={!!widget} onOpenChange={(open) => !open && select(null)}>
      <SheetContent>
        {widget && (
          <>
            <SheetHeader>
              <SheetTitle>{widgetLabels[widget.type]}</SheetTitle>
            </SheetHeader>

            {widget.type === "weather" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Localisation</Label>
                <Input
                  id="location"
                  defaultValue={String(widget.settings.location ?? "")}
                  onBlur={(e) =>
                    updateWidgetSettings(widget.id, {
                      location: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {widget.type === "agenda" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="icsUrl">URL du calendrier (.ics)</Label>
                <Input
                  id="icsUrl"
                  defaultValue={String(widget.settings.icsUrl ?? "")}
                  onBlur={(e) =>
                    updateWidgetSettings(widget.id, { icsUrl: e.target.value })
                  }
                />
              </div>
            )}

            {(widget.type === "clock" || widget.type === "quote") && (
              <p className="text-sm text-muted-foreground">
                Aucun réglage pour ce widget.
              </p>
            )}

            <Button
              variant="destructive"
              onClick={() => removeWidget(widget.id)}
            >
              Supprimer le widget
            </Button>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
