import { useEffect, useState } from "react";

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
}

export function useNewsFeed(feeds: string[], topics: string[]) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const feedsKey = feeds.join("|");
  const topicsKey = topics.join("|");

  useEffect(() => {
    if (feeds.length === 0) {
      setItems([]);
      setIsLoading(false);
      return;
    }
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          feeds: JSON.stringify(feeds),
          topics: JSON.stringify(topics),
        });
        const res = await fetch(`/api/news?${params.toString()}`);
        if (!res.ok) throw new Error("news fetch failed");
        const data = (await res.json()) as NewsItem[];
        if (!cancelled) setItems(data);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // feeds/topics sont des tableaux recréés à chaque rendu par le store —
    // on ne redéclenche l'effet que si leur contenu (feedsKey/topicsKey)
    // change réellement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedsKey, topicsKey]);

  return { items, isLoading };
}
