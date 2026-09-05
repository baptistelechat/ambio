import { DropletIcon, ThermometerIcon } from "lucide-react";
import * as React from "react";

import { useConfiguredWeather } from "@/hooks/useConfiguredWeather";
import { getWeatherIcon } from "@/lib/weather-utils";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetHeader,
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
  const [time, setTime] = React.useState<string>("");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("fr-FR", {
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

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
      <WidgetHeader>
        <WidgetTitle>{city}</WidgetTitle>
        <WidgetTitle className="font-normal">{time}</WidgetTitle>
      </WidgetHeader>
      <WidgetContent>
        {weather && getWeatherIcon(weather.weatherCode, "size-9")}
      </WidgetContent>
      <WidgetFooter>
        <div className="flex flex-col items-center">
          <div className="flex h-max w-full items-center justify-start">
            <ThermometerIcon className="mr-1 size-5" />
            <Label>{weather?.feelsLike}&deg;</Label>
          </div>
          <div className="flex h-max w-full items-center justify-start">
            <DropletIcon className="mr-1 size-5" />
            <Label>{weather?.humidity}%</Label>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Label className="text-4xl">{weather?.temperature}&deg;</Label>
        </div>
      </WidgetFooter>
    </Widget>
  );
}
