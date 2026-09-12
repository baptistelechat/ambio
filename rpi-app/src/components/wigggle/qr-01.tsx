import QRCode from "react-qr-code";
import { Label } from "@/components/ui/label";
import { Widget, WidgetContent, WidgetFooter } from "@/components/ui/widget";

export default function WidgetDemo({
  settings,
}: {
  settings: Record<string, unknown>;
}) {
  const mode = settings.mode === "wifi" ? "wifi" : "url";
  const ssid = typeof settings.wifiSsid === "string" ? settings.wifiSsid : "";
  const password =
    typeof settings.wifiPassword === "string" ? settings.wifiPassword : "";
  const url = typeof settings.url === "string" ? settings.url : "";

  const value =
    mode === "wifi" && ssid
      ? `WIFI:T:WPA;S:${ssid};P:${password};;`
      : url || "";

  return (
    <Widget>
      <WidgetContent className="flex-col gap-3">
        {value ? (
          <div className="rounded-xl bg-white p-3">
            <QRCode value={value} size={112} />
          </div>
        ) : (
          <Label className="text-muted-foreground text-center text-sm">
            Configurer une URL ou un Wi-Fi dans les réglages
          </Label>
        )}
      </WidgetContent>
      {value && (
        <WidgetFooter className="justify-center">
          <Label className="text-sm font-semibold">
            {mode === "wifi" ? ssid : "Scanner"}
          </Label>
        </WidgetFooter>
      )}
    </Widget>
  );
}
