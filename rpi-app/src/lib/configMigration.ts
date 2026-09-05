import {
  CELL_HEIGHT,
  CELL_WIDTH,
  GRID_COLS,
  GRID_ROWS,
  widgetDefaults,
  type WidgetType,
} from "./types.ts";

// Anciens noms de type (avant le renommage WigggleUI) → nouveaux.
const RENAMED_TYPES: Record<string, WidgetType> = {
  clockAlt: "wiggleClock1",
  weatherAlt: "wiggleWeather1",
  dateCard: "wiggleCalendar1",
};

// Widgets WigggleUI retirés (tableau de bord, bourse, sport, média, tâches).
const REMOVED_TYPES = new Set([
  "dashboard",
  "stock",
  "sports",
  "media",
  "todo",
]);

/**
 * Migre un config.json au format libre en pixels (x/y/width/height) vers la
 * grille actuelle (col/row), et retire/renomme les widgets obsolètes.
 * Utilisé côté client (fetchConfig) et côté serveur (readConfig) pour que
 * l'ancien config.json sur disque reste chargeable après ce changement de
 * schéma.
 */
export const normalizeConfig = (raw: unknown): unknown => {
  if (typeof raw !== "object" || raw === null || !("widgets" in raw)) {
    return raw;
  }
  const config = raw as { widgets?: unknown };
  if (!Array.isArray(config.widgets)) return raw;

  const widgets = config.widgets
    .map((entry) => {
      if (typeof entry !== "object" || entry === null) return null;
      const widget = entry as Record<string, unknown>;
      const rawType = String(widget.type);
      if (REMOVED_TYPES.has(rawType)) return null;

      const type = (RENAMED_TYPES[rawType] ?? rawType) as WidgetType;
      const defaults = widgetDefaults[type];
      if (!defaults) return null;

      if (typeof widget.col === "number" && typeof widget.row === "number") {
        return { ...widget, type };
      }

      const x = typeof widget.x === "number" ? widget.x : 0;
      const y = typeof widget.y === "number" ? widget.y : 0;
      const col = Math.min(
        Math.max(Math.round(x / CELL_WIDTH), 0),
        GRID_COLS - defaults.cols,
      );
      const row = Math.min(
        Math.max(Math.round(y / CELL_HEIGHT), 0),
        GRID_ROWS - defaults.rows,
      );

      return {
        id: widget.id,
        type,
        col,
        row,
        settings: widget.settings ?? {},
      };
    })
    .filter((w) => w !== null);

  return { ...config, widgets };
};
