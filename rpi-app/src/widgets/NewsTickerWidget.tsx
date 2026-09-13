import { NewspaperIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Widget, WidgetContent } from "@/components/ui/widget";
import { useNewsFeed } from "@/hooks/useNewsFeed";

// ponytail: le défilement continu (scroll marquee) sature à ~5fps sur la TV
// TCL cible quel que soit le nombre d'items ou les hints GPU — voir BLK-014.
// Un swap périodique avec fade court (pas d'animation soutenue) contourne le
// problème sans jamais l'avoir résolu.
const MAX_DISPLAYED_ITEMS = 10;
const ROTATE_INTERVAL_MS = 8000;
const FADE_MS = 250;

export const NewsTickerWidget = ({
  settings,
}: {
  settings: Record<string, unknown>;
}) => {
  const feeds = Array.isArray(settings.feeds)
    ? (settings.feeds as string[]).filter(Boolean)
    : [];
  const topics = Array.isArray(settings.topics)
    ? (settings.topics as string[]).filter(Boolean)
    : [];
  const { items: fetchedItems, isLoading } = useNewsFeed(feeds, topics);
  const items = fetchedItems.slice(0, MAX_DISPLAYED_ITEMS);

  const [prevItemsLength, setPrevItemsLength] = useState(items.length);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  if (items.length !== prevItemsLength) {
    setPrevItemsLength(items.length);
    setIndex(0);
  }

  useEffect(() => {
    if (items.length <= 1) return;
    let fadeTimeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setVisible(false);
      fadeTimeout = setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setVisible(true);
      }, FADE_MS);
    }, ROTATE_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimeout);
    };
  }, [items.length]);

  if (feeds.length === 0) {
    return (
      <Widget design="mumbai">
        <WidgetContent>
          <Label className="text-sm font-normal text-muted-foreground">
            Ajoutez des flux RSS dans les réglages
          </Label>
        </WidgetContent>
      </Widget>
    );
  }

  return (
    <Widget design="mumbai" className="flex-row items-center gap-3">
      <div className="flex shrink-0 items-center gap-2 border-r border-border pr-4">
        <NewspaperIcon className="size-7 text-primary" />
        <Label className="text-2xl">Actualités</Label>
      </div>
      <WidgetContent className="min-w-0 flex-1 justify-start overflow-hidden p-0">
        {items.length === 0 ? (
          <Label className="text-lg font-normal text-muted-foreground">
            {isLoading ? "Chargement…" : "Aucune actualité disponible"}
          </Label>
        ) : (
          <span
            className="line-clamp-2 px-4 text-2xl whitespace-normal transition-opacity"
            style={{
              opacity: visible ? 1 : 0,
              transitionDuration: `${FADE_MS}ms`,
            }}
          >
            <span className="mr-3 font-semibold text-muted-foreground">
              {items[index].source}
            </span>
            {items[index].title}
          </span>
        )}
      </WidgetContent>
    </Widget>
  );
};
