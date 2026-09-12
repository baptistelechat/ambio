import { useAirQuality } from "@/hooks/useAirQuality";
import { getAqiLevel } from "@/lib/air-quality-utils";
import { Label } from "@/components/ui/label";
import { Widget, WidgetContent, WidgetFooter } from "@/components/ui/widget";
import { cn } from "@/lib/utils";

export default function WidgetDemo({
  settings,
}: {
  settings: Record<string, unknown>;
}) {
  const location =
    typeof settings.location === "string" && settings.location
      ? settings.location
      : "Challans";
  const { data, isLoading } = useAirQuality(location);

  if (isLoading) {
    return (
      <Widget>
        <WidgetContent className="flex items-center justify-center">
          <Label className="animate-pulse">Chargement…</Label>
        </WidgetContent>
      </Widget>
    );
  }

  const level = data ? getAqiLevel(data.europeanAqi) : null;

  return (
    <Widget>
      <WidgetContent>
        <Label
          className={cn(
            "text-7xl font-semibold",
            level?.colorClass ?? "text-muted-foreground",
          )}
        >
          {data?.europeanAqi ?? "—"}
        </Label>
      </WidgetContent>
      <WidgetFooter className="justify-center">
        <Label className="text-lg font-semibold">
          {level?.label ?? "Indisponible"}
        </Label>
      </WidgetFooter>
    </Widget>
  );
}
