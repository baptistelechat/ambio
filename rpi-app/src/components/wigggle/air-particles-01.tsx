import { CloudFogIcon } from "lucide-react";
import { useAirQuality } from "@/hooks/useAirQuality";
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
        <CloudFogIcon className="stroke-gray-400 size-16" />
        <Label className="text-4xl">{data ? Math.round(data.pm25) : "—"}</Label>
      </WidgetContent>
      <WidgetFooter className="justify-center">
        <Label className="text-lg font-semibold">PM2.5 (µg/m³)</Label>
      </WidgetFooter>
    </Widget>
  );
}
