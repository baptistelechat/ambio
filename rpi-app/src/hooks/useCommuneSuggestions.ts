import { useEffect, useState } from "react";

export function useCommuneSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query)}&fields=nom&boost=population&limit=8`,
        );
        if (!res.ok) throw new Error("Failed to fetch communes");
        const result = (await res.json()) as { nom: string }[];
        if (!cancelled) setSuggestions(result.map((c) => c.nom));
      } catch {
        if (!cancelled) setSuggestions([]);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  return suggestions;
}
