import type { WidgetType } from "@/lib/types";

export type SettingsField =
  | { key: string; label: string; kind: "text" }
  | {
      key: string;
      label: string;
      kind: "select";
      options: { value: string; label: string }[];
    };

export const TIMEZONE_OPTIONS = [
  { value: "Europe/Paris", label: "Paris" },
  { value: "Europe/London", label: "Londres" },
  { value: "America/New_York", label: "New York" },
  { value: "America/Los_Angeles", label: "Los Angeles" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Asia/Seoul", label: "Séoul" },
  { value: "Asia/Kolkata", label: "Bombay" },
  { value: "Asia/Dubai", label: "Dubaï" },
  { value: "Australia/Sydney", label: "Sydney" },
  { value: "Pacific/Auckland", label: "Auckland" },
  { value: "America/Sao_Paulo", label: "São Paulo" },
  { value: "Europe/Moscow", label: "Moscou" },
  { value: "UTC", label: "UTC" },
];

const locationField: SettingsField = {
  key: "location",
  label: "Localisation",
  kind: "text",
};

const timezoneFields = (count: number): SettingsField[] =>
  Array.from({ length: count }, (_, i) => ({
    key: `tz${i + 1}`,
    label: `Fuseau ${i + 1}`,
    kind: "select",
    options: TIMEZONE_OPTIONS,
  }));

export const widgetSettingsFields: Partial<
  Record<WidgetType, SettingsField[]>
> = {
  weather: [locationField],
  agenda: [{ key: "icsUrl", label: "URL du calendrier (.ics)", kind: "text" }],
  wiggleWeather1: [locationField],
  wiggleWeather6: [locationField],
  wiggleWeather8: [locationField],
  wiggleWeather9: [locationField],
  wiggleWeatherMd1: [locationField],
  wiggleWeatherMd2: [locationField],
  wiggleClock7: timezoneFields(2),
  wiggleClock8: timezoneFields(4),
  wiggleClock9: timezoneFields(4),
};
