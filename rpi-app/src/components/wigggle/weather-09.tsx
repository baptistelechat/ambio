import { useConfiguredWeather } from "@/hooks/useConfiguredWeather";
import { getWeatherIcon } from "@/lib/weather-utils";
import { Label } from "@/components/ui/label";
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
  const { data: weather, isLoading } = useConfiguredWeather(location);

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { weekday: "short" });
  };

  const forecast =
    weather?.daily?.time.slice(0, 4).map((time, index) => ({
      day: getDayName(time),
      min: weather.daily.temperatureMin[index],
      max: weather.daily.temperatureMax[index],
      weatherCode: weather.daily.weatherCode[index],
    })) || [];

  if (isLoading) {
    return (
      <Widget design="mumbai">
        <WidgetContent className="flex items-center justify-center">
          <Label className="animate-pulse">Chargement…</Label>
        </WidgetContent>
      </Widget>
    );
  }

  return (
    <Widget design="mumbai">
      <WidgetContent className="mt-1.5 flex w-full flex-col gap-2">
        {forecast.map((el, index) => (
          <div
            key={index}
            className="grid w-full grid-cols-4 items-center gap-3 border-b pb-2 last:border-none"
          >
            <Label className="text-muted-foreground text-base">{el.day}</Label>
            {getWeatherIcon(el.weatherCode, "size-4", { className: "mx-auto" })}
            <Label className="mx-aut text-base">{el.min}&deg;</Label>
            <Label className="mx-auto text-base">{el.max}&deg;</Label>
          </div>
        ))}
      </WidgetContent>
    </Widget>
  );
}
