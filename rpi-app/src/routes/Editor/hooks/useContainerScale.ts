import { useEffect, useRef, useState } from "react";

export const useContainerScale = (logicalWidth: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setScale(entry.contentRect.width / logicalWidth);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [logicalWidth]);

  return { containerRef, scale };
};
