import { useEffect, useState } from "react";
import { geocode } from "@/lib/geocode";

type WeatherData = { temperature: number; code: number };

const weatherEmoji = (code: number): string => {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌡️";
};

export const WeatherWidget = ({
  settings,
}: {
  settings: Record<string, unknown>;
}) => {
  const location =
    typeof settings.location === "string" ? settings.location : "Challans";
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { lat, lon } = await geocode(location);
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`,
        );
        const data = (await res.json()) as {
          current: { temperature_2m: number; weather_code: number };
        };
        if (!cancelled) {
          setWeather({
            temperature: data.current.temperature_2m,
            code: data.current.weather_code,
          });
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    };

    load();
    const id = setInterval(load, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [location]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-white drop-shadow-lg">
      {error && <span className="text-sm opacity-80">Météo indisponible</span>}
      {!error && weather && (
        <>
          <span className="text-5xl">{weatherEmoji(weather.code)}</span>
          <span className="text-3xl font-semibold">
            {Math.round(weather.temperature)}°C
          </span>
          <span className="text-sm opacity-90">{location}</span>
        </>
      )}
      {!error && !weather && (
        <span className="text-sm opacity-80">Chargement…</span>
      )}
    </div>
  );
};
