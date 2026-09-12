import { PartyPopperIcon } from "lucide-react";
import { useNameday } from "@/hooks/useNameday";
import { Label } from "@/components/ui/label";
import { Widget, WidgetContent, WidgetFooter } from "@/components/ui/widget";

export default function WidgetDemo() {
  const { name, isLoading } = useNameday();

  return (
    <Widget>
      <WidgetContent>
        <PartyPopperIcon className="stroke-gray-400 size-16" />
      </WidgetContent>
      <WidgetFooter className="justify-center">
        <Label className="justify-center text-center text-lg font-semibold whitespace-normal">
          {isLoading ? "…" : (name ?? "—")}
        </Label>
      </WidgetFooter>
    </Widget>
  );
}
