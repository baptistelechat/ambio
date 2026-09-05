import { useEffect, useState } from "react";

export const useFullscreenScale = (
  logicalWidth: number,
  logicalHeight: number,
) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () =>
      setScale(
        Math.min(
          window.innerWidth / logicalWidth,
          window.innerHeight / logicalHeight,
        ),
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [logicalWidth, logicalHeight]);

  return scale;
};
