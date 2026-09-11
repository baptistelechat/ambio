import { useEffect, useState } from "react";

// ponytail: le Drawer (vaul) se rend dans un portail qui échappe à tout
// `md:hidden` CSS posé sur son parent — il faut un garde JS pour éviter
// qu'il reste monté (et visible) sur desktop.
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < breakpoint,
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
};
