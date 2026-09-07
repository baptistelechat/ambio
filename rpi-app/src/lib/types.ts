import { z } from "zod";

export const widgetTypeSchema = z.enum([
  "weather",
  "clock",
  "quote",
  "agenda",
  "wiggleClock1",
  "wiggleClock2",
  "wiggleClock3",
  "wiggleClock4",
  "wiggleClock5",
  "wiggleClock7",
  "wiggleClock8",
  "wiggleClock9",
  "wiggleCalendar1",
  "wiggleCalendar3",
  "wiggleCalendarMd1",
  "wiggleWeather1",
  "wiggleWeather6",
  "wiggleWeather8",
  "wiggleWeather9",
  "wiggleWeatherMd1",
  "wiggleWeatherMd2",
]);
export type WidgetType = z.infer<typeof widgetTypeSchema>;

export const widgetSchema = z.object({
  id: z.string(),
  type: widgetTypeSchema,
  col: z.number().int(),
  row: z.number().int(),
  settings: z.record(z.string(), z.unknown()),
});
export type Widget = z.infer<typeof widgetSchema>;

export const backgroundSchema = z.object({
  type: z.enum(["image", "video", "gradient"]),
  url: z.string(),
  gradientPreset: z.string().optional(),
});
export type Background = z.infer<typeof backgroundSchema>;

export const configSchema = z.object({
  background: backgroundSchema,
  widgets: z.array(widgetSchema),
});
export type Config = z.infer<typeof configSchema>;

// Grille façon écran d'accueil Android, sur la résolution fixe de la TV
// (1920x1080). Une marge (GRID_PADDING) isole la grille du bord de l'écran,
// un espacement (GRID_GAP) sépare chaque widget de ses voisins — la taille
// de cellule est donc dérivée, pas un multiple exact de la résolution.
export const GRID_COLS = 16;
export const GRID_ROWS = 9;
export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;
export const GRID_PADDING = 24;
export const GRID_GAP = 16;
export const CELL_WIDTH = (CANVAS_WIDTH - 2 * GRID_PADDING) / GRID_COLS;
export const CELL_HEIGHT = (CANVAS_HEIGHT - 2 * GRID_PADDING) / GRID_ROWS;

export const defaultConfig: Config = {
  background: { type: "image", url: "" },
  widgets: [],
};

export const widgetDefaults: Record<
  WidgetType,
  { cols: number; rows: number; settings: Record<string, unknown> }
> = {
  weather: { cols: 3, rows: 2, settings: { location: "Challans" } },
  clock: { cols: 3, rows: 2, settings: {} },
  quote: { cols: 5, rows: 1, settings: {} },
  agenda: { cols: 4, rows: 3, settings: { icsUrl: "" } },
  wiggleClock1: { cols: 2, rows: 2, settings: {} },
  wiggleClock2: { cols: 2, rows: 2, settings: {} },
  wiggleClock3: { cols: 2, rows: 2, settings: {} },
  wiggleClock4: { cols: 2, rows: 2, settings: {} },
  wiggleClock5: { cols: 2, rows: 2, settings: {} },
  wiggleClock7: {
    cols: 2,
    rows: 2,
    settings: { tz1: "Europe/Paris", tz2: "Asia/Tokyo" },
  },
  wiggleClock8: {
    cols: 2,
    rows: 2,
    settings: {
      tz1: "Europe/Paris",
      tz2: "Europe/London",
      tz3: "Asia/Tokyo",
      tz4: "Asia/Seoul",
    },
  },
  wiggleClock9: {
    cols: 2,
    rows: 2,
    settings: {
      tz1: "Europe/Paris",
      tz2: "Europe/London",
      tz3: "Asia/Tokyo",
      tz4: "Asia/Seoul",
    },
  },
  wiggleCalendar1: { cols: 2, rows: 2, settings: {} },
  wiggleCalendar3: { cols: 2, rows: 2, settings: {} },
  wiggleCalendarMd1: { cols: 4, rows: 2, settings: {} },
  wiggleWeather1: { cols: 2, rows: 2, settings: { location: "Challans" } },
  wiggleWeather6: { cols: 2, rows: 2, settings: { location: "Challans" } },
  wiggleWeather8: { cols: 2, rows: 2, settings: { location: "Challans" } },
  wiggleWeather9: { cols: 2, rows: 2, settings: { location: "Challans" } },
  wiggleWeatherMd1: { cols: 4, rows: 2, settings: { location: "Challans" } },
  wiggleWeatherMd2: { cols: 4, rows: 2, settings: { location: "Challans" } },
};

export const widgetLabels: Record<WidgetType, string> = {
  weather: "Météo",
  clock: "Heure / Date",
  quote: "Proverbe du jour",
  agenda: "Agenda",
  wiggleClock1: "Horloge minimaliste",
  wiggleClock2: "Horloge digitale",
  wiggleClock3: "Horloge + jour",
  wiggleClock4: "Horloge analogique",
  wiggleClock5: "Horloge analogique graduée",
  wiggleClock7: "Horloge 2 fuseaux",
  wiggleClock8: "Horloge 4 fuseaux (liste)",
  wiggleClock9: "Horloge 4 fuseaux (grille)",
  wiggleCalendar1: "Carte date",
  wiggleCalendar3: "Mini calendrier mensuel",
  wiggleCalendarMd1: "Calendrier mensuel",
  wiggleWeather1: "Météo compacte",
  wiggleWeather6: "Météo + heure",
  wiggleWeather8: "Météo min/max",
  wiggleWeather9: "Prévisions 4 jours",
  wiggleWeatherMd1: "Météo détaillée",
  wiggleWeatherMd2: "Météo horaire",
};

export type WidgetCategory = "classique" | "wiggleui";

export const widgetCategory: Record<WidgetType, WidgetCategory> = {
  weather: "classique",
  clock: "classique",
  quote: "classique",
  agenda: "classique",
  wiggleClock1: "wiggleui",
  wiggleClock2: "wiggleui",
  wiggleClock3: "wiggleui",
  wiggleClock4: "wiggleui",
  wiggleClock5: "wiggleui",
  wiggleClock7: "wiggleui",
  wiggleClock8: "wiggleui",
  wiggleClock9: "wiggleui",
  wiggleCalendar1: "wiggleui",
  wiggleCalendar3: "wiggleui",
  wiggleCalendarMd1: "wiggleui",
  wiggleWeather1: "wiggleui",
  wiggleWeather6: "wiggleui",
  wiggleWeather8: "wiggleui",
  wiggleWeather9: "wiggleui",
  wiggleWeatherMd1: "wiggleui",
  wiggleWeatherMd2: "wiggleui",
};
