import {
  CloudRainIcon,
  DropletsIcon,
  ThermometerIcon,
  WindIcon,
} from "lucide-react";
import type * as React from "react";

import { useConfiguredWeather } from "@/hooks/useConfiguredWeather";
import { getWeatherIcon } from "@/lib/weather-utils";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const { data: weather, city, isLoading } = useConfiguredWeather(location);

  if (isLoading) {
    return (
      <Widget size="md">
        <WidgetContent>
          <div className="flex w-full items-center justify-center">
            <Label className="animate-pulse">Chargement de la météo…</Label>
          </div>
        </WidgetContent>
      </Widget>
    );
  }

  return (
    <Widget size="md">
      <WidgetContent>
        <div className="flex w-full flex-col items-center justify-center gap-3">
          {weather && getWeatherIcon(weather.weatherCode)}
          <div className="flex flex-col items-center justify-center gap-2">
            <Label className="text-3xl">{weather?.temperature}&deg;C</Label>
            <Label>{city}</Label>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 items-center justify-items-center gap-x-16 gap-y-5">
          {/* Grille (pas 2 flex rows indépendantes) pour que les colonnes
              restent alignées quel que soit la largeur de chaque valeur
              ("10.1 km/h" vs "0 mm" ont des largeurs différentes). */}
          <InfoItem
            icon={WindIcon}
            label="Vent"
            value={`${weather?.windSpeed} km/h`}
          />
          <InfoItem
            icon={ThermometerIcon}
            label="Ressenti"
            value={`${weather?.feelsLike}°`}
          />
          <InfoItem
            icon={CloudRainIcon}
            label="Précipitations"
            value={`${weather?.chanceOfRain} mm`}
          />
          <InfoItem
            icon={DropletsIcon}
            label="Humidité"
            value={`${weather?.humidity}%`}
          />
        </div>
      </WidgetContent>
    </Widget>
  );
}

type InfoItemProps = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
};

const InfoItem = (el: InfoItemProps) => {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <div className="space-y-2 text-center">
          <el.icon className="stroke-muted-foreground mx-auto size-6" />
          <Label className="justify-center text-base font-normal">
            {el.value}
          </Label>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <Label className="text-sm font-normal">{el.label}</Label>
      </TooltipContent>
    </Tooltip>
  );
};
