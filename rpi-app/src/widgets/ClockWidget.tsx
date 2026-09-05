import { useEffect, useState } from "react";

export const ClockWidget = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
  const date = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-white drop-shadow-lg">
      <span className="text-6xl font-semibold tabular-nums">{time}</span>
      <span className="mt-1 text-lg capitalize opacity-90">{date}</span>
    </div>
  );
};
