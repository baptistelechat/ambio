import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { widgetLabels } from "@/lib/types";
import { widgetSettingsFields } from "@/lib/widgetSettings";
import { useEditorStore } from "@/store/editorStore";

export const SettingsPanel = () => {
  const selectedWidgetId = useEditorStore((s) => s.selectedWidgetId);
  const widget = useEditorStore((s) =>
    s.config.widgets.find((w) => w.id === selectedWidgetId),
  );
  const select = useEditorStore((s) => s.select);
  const updateWidgetSettings = useEditorStore((s) => s.updateWidgetSettings);
  const removeWidget = useEditorStore((s) => s.removeWidget);

  const fields = widget ? (widgetSettingsFields[widget.type] ?? []) : [];

  return (
    <Sheet open={!!widget} onOpenChange={(open) => !open && select(null)}>
      <SheetContent>
        {widget && (
          <>
            <SheetHeader>
              <SheetTitle>{widgetLabels[widget.type]}</SheetTitle>
            </SheetHeader>

            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucun réglage pour ce widget.
              </p>
            )}

            {fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.kind === "text" ? (
                  <Input
                    id={field.key}
                    defaultValue={String(widget.settings[field.key] ?? "")}
                    onBlur={(e) =>
                      updateWidgetSettings(widget.id, {
                        [field.key]: e.target.value,
                      })
                    }
                  />
                ) : (
                  <Select
                    defaultValue={String(widget.settings[field.key] ?? "")}
                    onValueChange={(value) =>
                      updateWidgetSettings(widget.id, { [field.key]: value })
                    }
                  >
                    <SelectTrigger id={field.key}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}

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
