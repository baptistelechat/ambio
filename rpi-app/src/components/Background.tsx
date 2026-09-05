import type { Background as BackgroundConfig } from "@/lib/types";

export const Background = ({
  background,
}: {
  background: BackgroundConfig;
}) => {
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
