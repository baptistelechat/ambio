import { useEffect, useState } from "react";
import { Background } from "@/components/Background";
import { useFullscreenScale } from "@/hooks/useFullscreenScale";
import { fetchConfig, subscribeConfigUpdates } from "@/lib/configClient";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  type Config,
  defaultConfig,
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
        className="relative"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        <Background background={config.background} />

        {config.widgets.map((widget) => (
          <div
            key={widget.id}
            className="absolute"
            style={{
              left: widget.x,
              top: widget.y,
              width: widget.width,
              height: widget.height,
            }}
          >
            <WidgetRenderer widget={widget} />
          </div>
        ))}
      </div>
    </div>
  );
};
