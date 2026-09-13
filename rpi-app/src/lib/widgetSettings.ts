import { NEWS_FEED_CATALOG, NEWS_TOPIC_CATALOG } from "@/lib/newsFeeds";
import type { WidgetType } from "@/lib/types";

export type SettingsField =
  | { key: string; label: string; kind: "text" }
  | { key: string; label: string; kind: "location" }
  | {
      key: string;
      label: string;
      kind: "select";
      options: { value: string; label: string }[];
    }
  | {
      key: string;
      label: string;
      kind: "timezone";
      groups: TimezoneGroup[];
    }
  | {
      key: string;
      label: string;
      kind: "checklist";
      options: { value: string; label: string; group?: string }[];
    }
  | {
      key: string;
      label: string;
      kind: "range";
      min: number;
      max: number;
      step?: number;
    };

export interface TimezoneGroup {
  area: string;
  label: string;
  options: { value: string; label: string }[];
}

// Etc/GMT+X a un signe inversé par rapport à l'UTC réel (ex: Etc/GMT+5 = UTC-5) — source de confusion, exclu.
const AREA_LABELS: Record<string, string> = {
  Africa: "Afrique",
  America: "Amérique",
  Antarctica: "Antarctique",
  Arctic: "Arctique",
  Asia: "Asie",
  Atlantic: "Atlantique",
  Australia: "Australie",
  Europe: "Europe",
  Indian: "Océan Indien",
  Pacific: "Pacifique",
  UTC: "UTC",
};

const utcOffsetMinutes = (tz: string): number => {
  const raw = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "shortOffset",
  })
    .formatToParts(new Date())
    .find((p) => p.type === "timeZoneName")?.value;
  const match = raw?.match(/GMT([+-]\d+)(?::(\d+))?/);
  if (!match) return 0;
  const sign = match[1].startsWith("-") ? -1 : 1;
  return sign * (Math.abs(Number(match[1])) * 60 + Number(match[2] ?? 0));
};

const utcOffsetLabel = (minutes: number): string => {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;
  return mins === 0
    ? `UTC${sign}${hours}`
    : `UTC${sign}${hours}:${String(mins).padStart(2, "0")}`;
};

// "UTC" n'est pas toujours listé par Intl.supportedValuesOf selon le moteur JS —
// on le garantit explicitement, c'est une entrée attendue dans tout sélecteur de fuseau.
const ALL_TIMEZONES = Array.from(
  new Set([...Intl.supportedValuesOf("timeZone"), "UTC"]),
);

const groupedByArea = ALL_TIMEZONES.filter(
  (tz) => !tz.startsWith("Etc/"),
).reduce<Record<string, { value: string; label: string }[]>>((acc, tz) => {
  const area = tz.split("/")[0];
  const city = tz.split("/").pop()?.replace(/_/g, " ") ?? tz;
  const offset = utcOffsetMinutes(tz);
  (acc[area] ??= []).push({
    value: tz,
    label: `${city} (${utcOffsetLabel(offset)})`,
  });
  return acc;
}, {});

export const TIMEZONE_GROUPS: TimezoneGroup[] = Object.entries(groupedByArea)
  .map(([area, options]) => ({
    area,
    label: AREA_LABELS[area] ?? area,
    options: options.sort((a, b) => a.label.localeCompare(b.label, "fr")),
  }))
  .sort((a, b) => a.label.localeCompare(b.label, "fr"));

const locationField: SettingsField = {
  key: "location",
  label: "Localisation",
  kind: "location",
};

const timezoneFields = (count: number): SettingsField[] =>
  Array.from({ length: count }, (_, i) => ({
    key: `tz${i + 1}`,
    label: `Fuseau ${i + 1}`,
    kind: "timezone",
    groups: TIMEZONE_GROUPS,
  }));

export const widgetSettingsFields: Partial<
  Record<WidgetType, SettingsField[]>
> = {
  weather: [locationField],
  agenda: [{ key: "icsUrl", label: "URL du calendrier (.ics)", kind: "text" }],
  newsTicker: [
    {
      key: "width",
      label: "Largeur (colonnes)",
      kind: "range",
      min: 4,
      max: 16,
    },
    {
      key: "feeds",
      label: "Flux RSS",
      kind: "checklist",
      options: NEWS_FEED_CATALOG.map((feed) => ({
        value: feed.id,
        label: feed.label,
        group: feed.category,
      })),
    },
    {
      key: "topics",
      label: "Thèmes (optionnel, filtre les titres)",
      kind: "checklist",
      options: NEWS_TOPIC_CATALOG.map((topic) => ({
        value: topic.id,
        label: topic.label,
      })),
    },
  ],
  wiggleWeather1: [locationField],
  wiggleWeather6: [locationField],
  wiggleWeather8: [locationField],
  wiggleWeather9: [locationField],
  wiggleWeatherMd1: [locationField],
  wiggleWeatherMd2: [locationField],
  wiggleClock7: timezoneFields(2),
  wiggleClock8: timezoneFields(4),
  wiggleClock9: timezoneFields(4),
  wiggleAirQuality1: [locationField],
  wiggleAirQualityMd1: [locationField],
  wiggleUv1: [locationField],
  wigglePollen1: [locationField],
  wiggleAirParticles1: [locationField],
  wiggleQr1: [
    {
      key: "mode",
      label: "Type de contenu",
      kind: "select",
      options: [
        { value: "url", label: "Lien / URL" },
        { value: "wifi", label: "Wi-Fi" },
      ],
    },
    { key: "url", label: "URL", kind: "text" },
    { key: "wifiSsid", label: "Nom du réseau (SSID)", kind: "text" },
    { key: "wifiPassword", label: "Mot de passe Wi-Fi", kind: "text" },
  ],
};
