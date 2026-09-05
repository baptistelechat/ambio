import { z } from "zod";

export const widgetTypeSchema = z.enum(["weather", "clock", "quote", "agenda"]);
export type WidgetType = z.infer<typeof widgetTypeSchema>;

export const widgetSchema = z.object({
  id: z.string(),
  type: widgetTypeSchema,
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  settings: z.record(z.string(), z.unknown()),
});
export type Widget = z.infer<typeof widgetSchema>;

export const backgroundSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string(),
});
export type Background = z.infer<typeof backgroundSchema>;

export const configSchema = z.object({
  background: backgroundSchema,
  widgets: z.array(widgetSchema),
});
export type Config = z.infer<typeof configSchema>;

export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;

export const defaultConfig: Config = {
  background: { type: "image", url: "" },
  widgets: [],
};

export const widgetDefaults: Record<
  WidgetType,
  { width: number; height: number; settings: Record<string, unknown> }
> = {
  weather: { width: 320, height: 160, settings: { location: "Challans" } },
  clock: { width: 320, height: 140, settings: {} },
  quote: { width: 500, height: 120, settings: {} },
  agenda: { width: 420, height: 260, settings: { icsUrl: "" } },
};

export const widgetLabels: Record<WidgetType, string> = {
  weather: "Météo",
  clock: "Heure / Date",
  quote: "Proverbe du jour",
  agenda: "Agenda",
};
