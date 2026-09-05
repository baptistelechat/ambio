import { useEffect, useState } from "react";
import { Background } from "@/components/Background";
import { useFullscreenScale } from "@/hooks/useFullscreenScale";
import { fetchConfig, subscribeConfigUpdates } from "@/lib/configClient";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CELL_HEIGHT,
  CELL_WIDTH,
  type Config,
  defaultConfig,
  GRID_GAP,
  GRID_PADDING,
  widgetDefaults,
} from "@/lib/types";
import { WidgetRenderer } from "@/widgets/WidgetRenderer";

export const Screensaver = () => {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const scale = useFullscreenScale(CANVAS_WIDTH, CANVAS_HEIGHT);

  useEffect(() => {
    const reload = () => {
      fetchConfig()
        .then(setConfig)
        .catch(() => {});
    };
    reload();
    return subscribeConfigUpdates(reload);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
      <div
        className="relative shrink-0"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        <Background background={config.background} />

        {config.widgets.map((widget) => {
          const { cols, rows } = widgetDefaults[widget.type];
          return (
            <div
              key={widget.id}
              className="absolute"
              style={{
                left: GRID_PADDING + widget.col * CELL_WIDTH + GRID_GAP / 2,
                top: GRID_PADDING + widget.row * CELL_HEIGHT + GRID_GAP / 2,
                width: cols * CELL_WIDTH - GRID_GAP,
                height: rows * CELL_HEIGHT - GRID_GAP,
              }}
            >
              <WidgetRenderer widget={widget} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
