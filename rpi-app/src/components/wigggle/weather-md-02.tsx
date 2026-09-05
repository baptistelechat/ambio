import { useConfiguredWeather } from "@/hooks/useConfiguredWeather";
import { getSmallWeatherIcon, getWeatherIcon } from "@/lib/weather-utils";
import { Label } from "@/components/ui/label";
import { Widget, WidgetContent, WidgetHeader } from "@/components/ui/widget";

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

  const next6Hours =
    weather?.hourly.time.slice(0, 6).map((time, index) => {
      const date = new Date(time);
      return {
        time: date.toLocaleTimeString("fr-FR", {
          hour: "numeric",
          hour12: false,
        }),
        temp: weather.hourly.temperature[index],
        weatherCode: weather.hourly.weatherCode[index],
      };
    }) || [];

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
      <WidgetHeader className="items-start">
        <div className="flex flex-col items-start">
          <Label>{city}</Label>
          <Label className="text-4xl">{weather?.temperature}&deg;</Label>
        </div>
        <div className="flex flex-col items-start">
          {weather && getWeatherIcon(weather.weatherCode)}
        </div>
      </WidgetHeader>
      <WidgetContent className="mt-4 grid w-full grid-cols-6 items-end gap-6">
        {next6Hours.map((el, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <Label className="text-muted-foreground text-xs">{el.time}h</Label>
            <Label>{getSmallWeatherIcon(el.weatherCode)}</Label>
            <Label className="text-lg">{el.temp}&deg;</Label>
          </div>
        ))}
      </WidgetContent>
    </Widget>
  );
}
