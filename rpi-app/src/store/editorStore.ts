import { create } from "zustand";
import { fetchConfig, publishConfig, uploadAsset } from "@/lib/configClient";
import {
  type Background,
  type Config,
  defaultConfig,
  type Widget,
  widgetDefaults,
  type WidgetType,
} from "@/lib/types";

type EditorState = {
  config: Config;
  selectedWidgetId: string | null;
  status: "idle" | "loading" | "saving" | "saved" | "error";
  showGrid: boolean;
  load: () => Promise<void>;
  select: (id: string | null) => void;
  setShowGrid: (show: boolean) => void;
  addWidget: (type: WidgetType) => void;
  updateWidget: (id: string, patch: Partial<Widget>) => void;
  updateWidgetSettings: (id: string, settings: Record<string, unknown>) => void;
  removeWidget: (id: string) => void;
  setBackground: (background: Background) => void;
  uploadBackground: (file: File) => Promise<void>;
  publish: () => Promise<void>;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  config: defaultConfig,
  selectedWidgetId: null,
  status: "idle",
  showGrid: true,

  setShowGrid: (show) => set({ showGrid: show }),

  load: async () => {
    set({ status: "loading" });
    try {
      const config = await fetchConfig();
      set({ config, status: "idle" });
    } catch {
      set({ status: "error" });
    }
  },

  select: (id) => set({ selectedWidgetId: id }),

  addWidget: (type) => {
    const defaults = widgetDefaults[type];
    const widget: Widget = {
      id: crypto.randomUUID(),
      type,
      col: 0,
      row: 0,
      settings: { ...defaults.settings },
    };
    set((state) => ({
      config: { ...state.config, widgets: [...state.config.widgets, widget] },
      selectedWidgetId: widget.id,
    }));
  },

  updateWidget: (id, patch) => {
    set((state) => ({
      config: {
        ...state.config,
        widgets: state.config.widgets.map((w) =>
          w.id === id ? { ...w, ...patch } : w,
        ),
      },
    }));
  },

  updateWidgetSettings: (id, settings) => {
    set((state) => ({
      config: {
        ...state.config,
        widgets: state.config.widgets.map((w) =>
          w.id === id ? { ...w, settings: { ...w.settings, ...settings } } : w,
        ),
      },
    }));
  },

  removeWidget: (id) => {
    set((state) => ({
      config: {
        ...state.config,
        widgets: state.config.widgets.filter((w) => w.id !== id),
      },
      selectedWidgetId:
        state.selectedWidgetId === id ? null : state.selectedWidgetId,
    }));
  },

  setBackground: (background) =>
    set((state) => ({ config: { ...state.config, background } })),

  uploadBackground: async (file) => {
    const url = await uploadAsset(file);
    const type = file.type.startsWith("video") ? "video" : "image";
    get().setBackground({ type, url });
  },

  publish: async () => {
    set({ status: "saving" });
    try {
      await publishConfig(get().config);
      set({ status: "saved" });
    } catch {
      set({ status: "error" });
    }
  },
}));
