import { CloudFogIcon, Flower2Icon, GaugeIcon, SunIcon } from "lucide-react";

import { useAirQuality } from "@/hooks/useAirQuality";
import { getAqiLevel, getPollenLevel } from "@/lib/air-quality-utils";
import { Label } from "@/components/ui/label";
import { InfoItem } from "@/components/ui/info-item";
import { Widget, WidgetContent } from "@/components/ui/widget";

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
      <Widget size="md">
        <WidgetContent>
          <div className="flex w-full items-center justify-center">
            <Label className="animate-pulse">
              Chargement de la qualité de l'air…
            </Label>
          </div>
        </WidgetContent>
      </Widget>
    );
  }

  const level = data ? getAqiLevel(data.europeanAqi) : null;

  return (
    <Widget size="md">
      <WidgetContent>
        <div className="grid w-full grid-cols-4 gap-4">
          <InfoItem
            icon={GaugeIcon}
            label="Qualité de l'air (AQI)"
            value={data ? String(data.europeanAqi) : "—"}
            unit={data ? "/100" : undefined}
            valueClassName={level?.colorClass}
          />
          <InfoItem
            icon={SunIcon}
            label="Indice UV"
            value={data ? data.uvIndex.toFixed(1) : "—"}
          />
          <InfoItem
            icon={Flower2Icon}
            label="Pollen"
            value={data ? getPollenLevel(data.pollenMax) : "—"}
          />
          <InfoItem
            icon={CloudFogIcon}
            label="Particules fines (PM2.5)"
            value={data ? String(Math.round(data.pm25)) : "—"}
            unit={data ? "µg/m³" : undefined}
          />
        </div>
      </WidgetContent>
    </Widget>
  );
}
