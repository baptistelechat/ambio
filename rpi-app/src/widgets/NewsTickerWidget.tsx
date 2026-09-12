import { NewspaperIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Widget, WidgetContent } from "@/components/ui/widget";
import { useNewsFeed } from "@/hooks/useNewsFeed";

const SCROLL_SPEED_PX_PER_SEC = 70;
const MIN_DURATION_SEC = 8;
// Le track anime une bande dupliquée en continu — sa largeur (donc la
// mémoire GPU à recomposer à chaque frame) grandit avec le nombre
// d'items. Sur un GPU de TV bas de gamme (peu de bande passante mémoire),
// une bande de plusieurs milliers de px saccade même en layer composité ;
// mesuré via `dumpsys gfxinfo` (86% de frames "janky", pics à 200ms) sur
// une TCL avec les ~15 items renvoyés par un seul flux. On plafonne donc
// l'affichage, indépendamment du nombre d'items agrégés côté serveur.
const MAX_DISPLAYED_ITEMS = 10;

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

  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(MIN_DURATION_SEC);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // Le track contient 2 copies des items bout à bout — la moitié de sa
    // largeur correspond donc à une seule copie, la distance parcourue
    // par la boucle -50% du keyframe (voir index.css).
    const singleCopyWidth = track.scrollWidth / 2;
    setDuration(
      Math.max(singleCopyWidth / SCROLL_SPEED_PX_PER_SEC, MIN_DURATION_SEC),
    );
  }, [items]);

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
          <div
            ref={trackRef}
            className="flex w-max items-center whitespace-nowrap"
            style={{
              animation: `ambio-news-marquee ${duration}s linear infinite`,
              // Promeut le track sur sa propre couche composite avant même
              // le premier frame — sur un WebView bas de gamme (TV Android),
              // laisser le navigateur découvrir l'animation au vol provoque
              // un à-coup visible en début (et parfois tout du long).
              willChange: "transform",
            }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center">
                {items.map((item, index) => (
                  <span
                    key={`${copy}-${item.link || index}`}
                    className="px-4 text-2xl"
                  >
                    <span className="mr-3 font-semibold text-muted-foreground">
                      {item.source}
                    </span>
                    {item.title}
                    <span className="ml-4 text-muted-foreground/50">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
      </WidgetContent>
    </Widget>
  );
};
