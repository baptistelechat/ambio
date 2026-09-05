import { useEffect, useState } from "react";
import { TIMEZONE_OPTIONS } from "@/lib/widgetSettings";

const cityLabel = (tz: string) =>
  TIMEZONE_OPTIONS.find((o) => o.value === tz)?.label ?? tz;

export function useZoneClocks(timezones: string[]) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();

  return timezones.map((tz) => {
    const time = new Intl.DateTimeFormat("fr-FR", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);
    const hour = Number(
      new Intl.DateTimeFormat("fr-FR", {
        timeZone: tz,
        hour: "2-digit",
        hour12: false,
      }).format(now),
    );
    return { tz, city: cityLabel(tz), time, isDay: hour >= 6 && hour < 20 };
  });
}
