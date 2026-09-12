import { Flower2Icon } from "lucide-react";
import { useAirQuality } from "@/hooks/useAirQuality";
import { getPollenLevel } from "@/lib/air-quality-utils";
import { Label } from "@/components/ui/label";
import { Widget, WidgetContent, WidgetFooter } from "@/components/ui/widget";

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

  return (
    <Widget>
      <WidgetContent className="flex-col gap-4">
        <Flower2Icon className="stroke-gray-400 size-16" />
        <Label className="text-4xl">
          {data ? getPollenLevel(data.pollenMax) : "—"}
        </Label>
      </WidgetContent>
      <WidgetFooter className="justify-center">
        <Label className="text-lg font-semibold">Pollen</Label>
      </WidgetFooter>
    </Widget>
  );
}
