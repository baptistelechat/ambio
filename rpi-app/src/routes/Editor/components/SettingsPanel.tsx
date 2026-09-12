import { Button } from "@/components/ui/button";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { widgetLabels } from "@/lib/types";
import { widgetSettingsFields } from "@/lib/widgetSettings";
import { ChecklistField } from "@/routes/Editor/components/ChecklistField";
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
      <SheetContent className="flex min-h-0 flex-col gap-4">
        {widget && (
          <>
            <SheetHeader className="flex-none">
              <SheetTitle>{widgetLabels[widget.type]}</SheetTitle>
            </SheetHeader>

            <ScrollArea className="-mx-1 min-h-0 flex-1 px-1">
              <div className="flex flex-col gap-4 pr-3">
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
                    ) : field.kind === "select" ? (
                      <Select
                        defaultValue={String(widget.settings[field.key] ?? "")}
                        onValueChange={(value) =>
                          updateWidgetSettings(widget.id, {
                            [field.key]: value,
                          })
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
                    ) : field.kind === "checklist" ? (
                      <ChecklistField
                        value={
                          Array.isArray(widget.settings[field.key])
                            ? (widget.settings[field.key] as string[])
                            : []
                        }
                        options={field.options}
                        onChange={(next) =>
                          updateWidgetSettings(widget.id, { [field.key]: next })
                        }
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <Slider
                          id={field.key}
                          min={field.min}
                          max={field.max}
                          step={field.step ?? 1}
                          defaultValue={[
                            Number(widget.settings[field.key] ?? field.min),
                          ]}
                          onValueChange={([next]) =>
                            updateWidgetSettings(widget.id, {
                              [field.key]: next,
                            })
                          }
                        />
                        <span className="w-6 shrink-0 text-right text-sm tabular-nums">
                          {Number(widget.settings[field.key] ?? field.min)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Button
              variant="destructive"
              className="flex-none"
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
