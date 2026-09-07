import Grainient from "@/components/Grainient";
import { getGradientPreset } from "@/lib/gradientPresets";
import type { Background as BackgroundConfig } from "@/lib/types";

export const Background = ({
  background,
}: {
  background: BackgroundConfig;
}) => {
  if (background.type === "gradient") {
    const preset = getGradientPreset(background.gradientPreset);
    return (
      <div className="absolute inset-0 h-full w-full">
        <Grainient
          color1={preset.color1}
          color2={preset.color2}
          color3={preset.color3}
          timeSpeed={0.12}
          warpStrength={0.6}
          warpAmplitude={40}
          grainAmount={0.05}
          contrast={1.3}
          zoom={1.1}
        />
      </div>
    );
  }

  if (!background.url) return null;
  return background.type === "video" ? (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      src={background.url}
      autoPlay
      loop
      muted
      playsInline
    />
  ) : (
    <img
      className="absolute inset-0 h-full w-full object-cover"
      src={background.url}
      alt=""
    />
  );
};
