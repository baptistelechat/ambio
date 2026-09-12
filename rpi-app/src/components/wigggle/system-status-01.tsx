import { ThermometerIcon } from "lucide-react";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import { Label } from "@/components/ui/label";
import { Widget, WidgetContent, WidgetFooter } from "@/components/ui/widget";

const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}j ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes}min`;
};

export default function WidgetDemo() {
  const { data, isLoading } = useSystemStatus();

  return (
    <Widget>
      <WidgetContent className="flex-col gap-2">
        <ThermometerIcon className="stroke-gray-400 size-16" />
        <Label className="text-3xl">
          {isLoading || data?.cpuTempC == null
            ? "N/A"
            : `${data.cpuTempC.toFixed(0)}°C`}
        </Label>
      </WidgetContent>
      <WidgetFooter className="justify-center">
        <Label className="text-muted-foreground text-sm">
          Uptime {data ? formatUptime(data.uptimeSeconds) : "—"}
        </Label>
      </WidgetFooter>
    </Widget>
  );
}
