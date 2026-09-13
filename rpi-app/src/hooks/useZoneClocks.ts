import { useEffect, useState } from "react";

export type DayPeriod = "sunrise" | "day" | "sunset" | "night";

const cityLabel = (tz: string) => tz.split("/").pop()?.replace(/_/g, " ") ?? tz;

// Un Intl.DateTimeFormat par fuseau, réutilisé — le reconstruire à chaque tick (30s × N fuseaux) est inutile.
const timeFormatters = new Map<string, Intl.DateTimeFormat>();
const hourFormatters = new Map<string, Intl.DateTimeFormat>();

const timeFormatter = (tz: string) => {
  let f = timeFormatters.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("fr-FR", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    timeFormatters.set(tz, f);
  }
  return f;
};

const hourFormatter = (tz: string) => {
  let f = hourFormatters.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      hour12: false,
    });
    hourFormatters.set(tz, f);
  }
  return f;
};

export function useZoneClocks(timezones: string[]) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();

  return timezones.map((tz) => {
    const time = timeFormatter(tz).format(now);
    const hour = Number(
      hourFormatter(tz)
        .formatToParts(now)
        .find((p) => p.type === "hour")?.value,
    );
    const period: DayPeriod =
      hour >= 6 && hour < 8
        ? "sunrise"
        : hour >= 8 && hour < 19
          ? "day"
          : hour >= 19 && hour < 21
            ? "sunset"
            : "night";
    return { tz, city: cityLabel(tz), time, period };
  });
}
