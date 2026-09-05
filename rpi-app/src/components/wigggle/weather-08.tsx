import { MoveDownIcon, MoveUpIcon } from "lucide-react";

import { useConfiguredWeather } from "@/hooks/useConfiguredWeather";
import { getWeatherIcon } from "@/lib/weather-utils";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetTitle,
} from "@/components/ui/widget";

export default function WidgetDemo({
  settings,
}: {
  settings: Record<string, unknown>;
}) {
  const location =
    typeof settings.location === "string" && settings.location
      ? settings.location
      : "Challans";
  const { data: weather, city, isLoading } = useConfiguredWeather(location);

  const todayMax = weather?.daily?.temperatureMax[0];
  const todayMin = weather?.daily?.temperatureMin[0];

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
      <WidgetTitle>{city}</WidgetTitle>
      <WidgetContent className="flex items-center justify-center gap-2">
        {weather &&
          getWeatherIcon(weather.weatherCode, "size-10", { strokeWidth: 2 })}
        <Label className="text-5xl">{weather?.temperature}&deg;</Label>
      </WidgetContent>
      <WidgetFooter className="justify-between gap-3">
        <div className="flex items-center justify-start">
          <MoveDownIcon
            fill="currentColor"
            className="mr-1 size-4"
            strokeWidth={4}
          />
          <Label>{todayMin}&deg;</Label>
        </div>
        <div className="flex h-max items-center justify-start">
          <MoveUpIcon
            fill="currentColor"
            className="mr-1 size-4"
            strokeWidth={4}
          />
          <Label>{todayMax}&deg;</Label>
        </div>
      </WidgetFooter>
    </Widget>
  );
}
