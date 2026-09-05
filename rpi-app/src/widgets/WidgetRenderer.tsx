import type { Widget } from "@/lib/types";
import { AgendaWidget } from "@/widgets/AgendaWidget";
import { ClockWidget } from "@/widgets/ClockWidget";
import { QuoteWidget } from "@/widgets/QuoteWidget";
import { WeatherWidget } from "@/widgets/WeatherWidget";

export const WidgetRenderer = ({ widget }: { widget: Widget }) => {
  switch (widget.type) {
    case "weather":
      return <WeatherWidget settings={widget.settings} />;
    case "clock":
      return <ClockWidget />;
    case "quote":
      return <QuoteWidget />;
    case "agenda":
      return <AgendaWidget settings={widget.settings} />;
  }
};
