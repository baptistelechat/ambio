import { MoonIcon, SunIcon } from "lucide-react";

import { Widget, WidgetContent, WidgetTitle } from "@/components/ui/widget";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useZoneClocks } from "@/hooks/useZoneClocks";

export default function WidgetDemo({
  settings,
}: {
  settings: Record<string, unknown>;
}) {
  const tz1 =
    typeof settings.tz1 === "string" && settings.tz1
      ? settings.tz1
      : "Europe/Paris";
  const tz2 =
    typeof settings.tz2 === "string" && settings.tz2
      ? settings.tz2
      : "Asia/Tokyo";
  const [zone1, zone2] = useZoneClocks([tz1, tz2]);

  return (
    <Widget>
      <WidgetContent className="flex-col justify-between gap-3">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            <Label>{zone1.city}</Label>
            {zone1.isDay ? (
              <SunIcon className="size-5" />
            ) : (
              <MoonIcon className="size-5" />
            )}
          </div>
          <WidgetTitle className="text-xl">{zone1.time}</WidgetTitle>
        </div>
        <Separator />
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            <Label>{zone2.city}</Label>
            {zone2.isDay ? (
              <SunIcon className="size-5" />
            ) : (
              <MoonIcon className="size-5" />
            )}
          </div>
          <WidgetTitle className="text-xl">{zone2.time}</WidgetTitle>
        </div>
      </WidgetContent>
    </Widget>
  );
}
