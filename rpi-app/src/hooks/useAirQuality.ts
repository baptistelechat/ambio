import { useEffect, useState } from "react";
import { geocode } from "@/lib/geocode";

interface AirQualityData {
  europeanAqi: number;
  uvIndex: number;
  pollenMax: number;
  pm25: number;
  pm10: number;
}

export function useAirQuality(location: string) {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const { lat, lon } = await geocode(location);
        const res = await fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,uv_index,pm2_5,pm10,alder_pollen,birch_pollen,grass_pollen,ragweed_pollen`,
        );
        if (!res.ok) throw new Error("Failed to fetch air quality data");
        const result = await res.json();
        if (cancelled) return;

        const current = result.current;
        setData({
          europeanAqi: Math.round(current.european_aqi),
          uvIndex: current.uv_index,
          pollenMax: Math.max(
            current.alder_pollen ?? 0,
            current.birch_pollen ?? 0,
            current.grass_pollen ?? 0,
            current.ragweed_pollen ?? 0,
          ),
          pm25: current.pm2_5,
          pm10: current.pm10,
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

  return { data, isLoading };
}
