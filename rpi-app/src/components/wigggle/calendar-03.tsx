import {
  Widget,
  WidgetHeader,
  WidgetTitle,
  WidgetContent,
} from "@/components/ui/widget";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

export default function WidgetDemo() {
  const now = new Date();

  const month = now.toLocaleString("fr-FR", { month: "long" });
  const year = now.getFullYear();
  const date = now.getDate();

  const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (new Date(year, now.getMonth(), 1).getDay() + 6) % 7;

  const fillerDays = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Widget className="gap-2" design="mumbai">
      <WidgetHeader className="justify-center">
        <WidgetTitle>
          {month} {year}
        </WidgetTitle>
      </WidgetHeader>
      <Separator className="h-0.5 rounded-full" />
      <WidgetContent>
        <div className="grid size-full grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((day, i) => (
            <div key={`weekday-${i}-${day}`} className="text-xs">
              {day}
            </div>
          ))}

          {fillerDays.map((_, i) => (
            <div key={`filler-${i}`} className="text-xs">
              &nbsp;
            </div>
          ))}

          {days.map((day) => (
            <div key={day} className="text-muted-foreground text-xs">
              {day === date ? (
                <Badge className="flex size-4 items-center justify-center p-2">
                  {day}
                </Badge>
              ) : (
                day
              )}
            </div>
          ))}
        </div>
      </WidgetContent>
    </Widget>
  );
}
