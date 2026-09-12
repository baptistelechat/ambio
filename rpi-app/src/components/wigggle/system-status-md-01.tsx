import { MemoryStickIcon, ThermometerIcon, TimerIcon } from "lucide-react";

import { useSystemStatus } from "@/hooks/useSystemStatus";
import { formatUptime } from "@/lib/system-status-utils";
import { InfoItem } from "@/components/ui/info-item";
import { Widget, WidgetContent } from "@/components/ui/widget";

export default function WidgetDemo() {
  const { data, isLoading } = useSystemStatus();

  return (
    <Widget size="md">
      <WidgetContent>
        <div className="grid w-full grid-cols-3 gap-4">
          <InfoItem
            icon={ThermometerIcon}
            label="Température CPU"
            value={
              isLoading || data?.cpuTempC == null
                ? "—"
                : data.cpuTempC.toFixed(0)
            }
            unit={data?.cpuTempC != null ? "°C" : undefined}
          />
          <InfoItem
            icon={MemoryStickIcon}
            label="Mémoire utilisée"
            value={
              isLoading || data?.ramUsedPercent == null
                ? "—"
                : String(data.ramUsedPercent)
            }
            unit={data?.ramUsedPercent != null ? "%" : undefined}
          />
          <InfoItem
            icon={TimerIcon}
            label="Uptime"
            value={isLoading || !data ? "—" : formatUptime(data.uptimeSeconds)}
          />
        </div>
      </WidgetContent>
    </Widget>
  );
}
