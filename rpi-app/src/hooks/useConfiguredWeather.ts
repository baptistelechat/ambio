import { useEffect, useState } from "react";
import { geocode } from "@/lib/geocode";

interface HourlyData {
  time: string[];
  temperature: number[];
  weatherCode: number[];
}

interface DailyData {
  time: string[];
  temperatureMax: number[];
  temperatureMin: number[];
  weatherCode: number[];
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  chanceOfRain: number;
  weatherCode: number;
  isDay: boolean;
  hourly: HourlyData;
  daily: DailyData;
}

export function useConfiguredWeather(location: string) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const { lat, lon } = await geocode(location);
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,is_day&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7`,
        );
        if (!res.ok) throw new Error("Failed to fetch weather data");
        const result = await res.json();
        if (cancelled) return;

        setData({
          temperature: Math.round(result.current.temperature_2m),
          humidity: result.current.relative_humidity_2m,
          windSpeed: result.current.wind_speed_10m,
          feelsLike: Math.round(result.current.apparent_temperature),
          chanceOfRain: result.current.precipitation,
          weatherCode: result.current.weather_code,
          isDay: result.current.is_day === 1,
          hourly: {
            time: result.hourly.time,
            temperature: result.hourly.temperature_2m.map((t: number) =>
              Math.round(t),
            ),
            weatherCode: result.hourly.weather_code,
          },
          daily: {
            time: result.daily.time,
            temperatureMax: result.daily.temperature_2m_max.map((t: number) =>
              Math.round(t),
            ),
            temperatureMin: result.daily.temperature_2m_min.map((t: number) =>
              Math.round(t),
            ),
            weatherCode: result.daily.weather_code,
          },
        });
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [location]);

  return { data, city: location, isLoading };
}
