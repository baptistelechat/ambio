import type { Widget } from "@/lib/types";
import { AgendaWidget } from "@/widgets/AgendaWidget";
import { ClockWidget } from "@/widgets/ClockWidget";
import { QuoteWidget } from "@/widgets/QuoteWidget";
import { WeatherWidget } from "@/widgets/WeatherWidget";
import WiggleClock1 from "@/components/wigggle/clock-01";
import WiggleClock2 from "@/components/wigggle/clock-02";
import WiggleClock3 from "@/components/wigggle/clock-03";
import WiggleClock4 from "@/components/wigggle/clock-04";
import WiggleClock5 from "@/components/wigggle/clock-05";
import WiggleClock7 from "@/components/wigggle/clock-07";
import WiggleClock8 from "@/components/wigggle/clock-08";
import WiggleClock9 from "@/components/wigggle/clock-09";
import WiggleCalendar1 from "@/components/wigggle/calendar-01";
import WiggleCalendar3 from "@/components/wigggle/calendar-03";
import WiggleCalendarMd1 from "@/components/wigggle/calendar-md-01";
import WiggleWeather1 from "@/components/wigggle/weather-01";
import WiggleWeather6 from "@/components/wigggle/weather-06";
import WiggleWeather8 from "@/components/wigggle/weather-08";
import WiggleWeather9 from "@/components/wigggle/weather-09";
import WiggleWeatherMd1 from "@/components/wigggle/weather-md-01";
import WiggleWeatherMd2 from "@/components/wigggle/weather-md-02";

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
    case "wiggleClock1":
      return <WiggleClock1 />;
    case "wiggleClock2":
      return <WiggleClock2 />;
    case "wiggleClock3":
      return <WiggleClock3 />;
    case "wiggleClock4":
      return <WiggleClock4 />;
    case "wiggleClock5":
      return <WiggleClock5 />;
    case "wiggleClock7":
      return <WiggleClock7 settings={widget.settings} />;
    case "wiggleClock8":
      return <WiggleClock8 settings={widget.settings} />;
    case "wiggleClock9":
      return <WiggleClock9 settings={widget.settings} />;
    case "wiggleCalendar1":
      return <WiggleCalendar1 />;
    case "wiggleCalendar3":
      return <WiggleCalendar3 />;
    case "wiggleCalendarMd1":
      return <WiggleCalendarMd1 />;
    case "wiggleWeather1":
      return <WiggleWeather1 settings={widget.settings} />;
    case "wiggleWeather6":
      return <WiggleWeather6 settings={widget.settings} />;
    case "wiggleWeather8":
      return <WiggleWeather8 settings={widget.settings} />;
    case "wiggleWeather9":
      return <WiggleWeather9 settings={widget.settings} />;
    case "wiggleWeatherMd1":
      return <WiggleWeatherMd1 settings={widget.settings} />;
    case "wiggleWeatherMd2":
      return <WiggleWeatherMd2 settings={widget.settings} />;
  }
};
