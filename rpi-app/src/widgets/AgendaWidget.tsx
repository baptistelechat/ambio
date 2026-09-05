import { useEffect, useState } from "react";

type AgendaEvent = { title: string; start: string; end: string };

export const AgendaWidget = ({
  settings,
}: {
  settings: Record<string, unknown>;
}) => {
  const icsUrl = typeof settings.icsUrl === "string" ? settings.icsUrl : "";
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!icsUrl) return;
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(
          `/api/agenda?url=${encodeURIComponent(icsUrl)}`,
        );
        if (!res.ok) throw new Error("agenda fetch failed");
        const data = (await res.json()) as AgendaEvent[];
        if (!cancelled) {
          setEvents(data);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    };

    load();
    const id = setInterval(load, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [icsUrl]);

  if (!icsUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-white/80">
        Agenda non configuré
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden p-2 text-white drop-shadow-lg">
      {error && <span className="text-sm opacity-80">Agenda indisponible</span>}
      {!error && events.length === 0 && (
        <span className="text-sm opacity-80">Aucun événement</span>
      )}
      {events.map((event) => (
        <div key={`${event.title}-${event.start}`} className="text-sm">
          <span className="font-semibold">
            {new Intl.DateTimeFormat("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(event.start))}
          </span>
          {" — "}
          <span className="opacity-90">{event.title}</span>
        </div>
      ))}
    </div>
  );
};
