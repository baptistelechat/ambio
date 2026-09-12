"use client";

import * as React from "react";

import { Widget, WidgetContent, WidgetTitle } from "@/components/ui/widget";

export default function WidgetDemo() {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  const day = days[time.getDay()];

  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");

  return (
    <Widget>
      <WidgetContent className="flex-col gap-2">
        <WidgetTitle className="text-2xl">{day}</WidgetTitle>
        <WidgetTitle className="text-5xl tracking-widest">
          {hours}:{minutes}
        </WidgetTitle>
      </WidgetContent>
    </Widget>
  );
}
