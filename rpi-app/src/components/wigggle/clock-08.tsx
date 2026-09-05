import { Widget, WidgetContent, WidgetTitle } from "@/components/ui/widget";
import { Label } from "@/components/ui/label";
import { useZoneClocks } from "@/hooks/useZoneClocks";

const DEFAULTS = ["Europe/Paris", "Europe/London", "Asia/Tokyo", "Asia/Seoul"];

export default function WidgetDemo({
  settings,
}: {
  settings: Record<string, unknown>;
}) {
  const tzs = DEFAULTS.map((fallback, i) => {
    const v = settings[`tz${i + 1}`];
    return typeof v === "string" && v ? v : fallback;
  });
  const zones = useZoneClocks(tzs);

  return (
    <Widget>
      <WidgetContent className="flex-col justify-between">
        {zones.map((z) => (
          <div
            key={z.tz}
            className="flex w-full items-center justify-between gap-2"
          >
            <Label className="text-sm">{z.city}</Label>
            <WidgetTitle>{z.time}</WidgetTitle>
          </div>
        ))}
      </WidgetContent>
    </Widget>
  );
}
