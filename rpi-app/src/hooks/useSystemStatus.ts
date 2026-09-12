import { useEffect, useState } from "react";

interface SystemStatusData {
  cpuTempC: number | null;
  uptimeSeconds: number;
}

export function useSystemStatus() {
  const [data, setData] = useState<SystemStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/system-status");
        if (!res.ok) throw new Error("Failed to fetch system status");
        const result = (await res.json()) as SystemStatusData;
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 30 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { data, isLoading };
}
