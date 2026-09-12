import { useEffect, useState } from "react";

interface AbalinNamedayResponse {
  success: boolean;
  data?: {
    fr?: string;
  };
}

const todayKey = () => new Date().toISOString().slice(0, 10);

export function useNameday() {
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const key = todayKey();

    const load = async () => {
      setIsLoading(true);
      try {
        // "today/UTC" : le paramètre timezone n'a aucun effet observé côté
        // API (toujours calculé en UTC), mais reste requis dans le chemin.
        const res = await fetch("https://nameday.abalin.net/api/V2/today/UTC");
        if (!res.ok) throw new Error("Failed to fetch nameday");
        const data = (await res.json()) as AbalinNamedayResponse;
        if (cancelled) return;
        setName(data.data?.fr ?? null);
      } catch {
        if (!cancelled) setName(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    // Re-fetch seulement au changement de jour, pas à chaque montage.
    const interval = setInterval(
      () => {
        if (todayKey() !== key) load();
      },
      60 * 60 * 1000,
    );

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { name, isLoading };
}
