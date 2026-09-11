import { useEffect, useState } from "react";
import { StaticGrid } from "@/components/StaticGrid";
import { useFullscreenScale } from "@/hooks/useFullscreenScale";
import { fetchConfig, subscribeConfigUpdates } from "@/lib/configClient";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  type Config,
  defaultConfig,
} from "@/lib/types";

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
        <StaticGrid config={config} />
      </div>
    </div>
  );
};
