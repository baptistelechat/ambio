import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const infoItemVariants = cva("", {
  variants: {
    layout: {
      row: "flex items-center justify-center gap-2",
      stack: "space-y-2 text-center",
    },
  },
  defaultVariants: { layout: "row" },
});

const infoItemIconVariants = cva("shrink-0", {
  variants: {
    layout: {
      row: "stroke-gray-400 size-10",
      stack: "stroke-muted-foreground mx-auto size-6",
    },
  },
  defaultVariants: { layout: "row" },
});

const infoItemValueVariants = cva("", {
  variants: {
    layout: {
      row: "text-3xl font-semibold",
      stack: "justify-center text-base font-normal",
    },
  },
  defaultVariants: { layout: "row" },
});

export interface InfoItemProps extends VariantProps<typeof infoItemVariants> {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  unit?: string;
  valueClassName?: string;
}

export const InfoItem = ({
  icon: Icon,
  label,
  value,
  unit,
  valueClassName,
  layout,
}: InfoItemProps) => (
  <Tooltip delayDuration={300}>
    <TooltipTrigger asChild>
      <div className={cn(infoItemVariants({ layout }))}>
        <Icon className={cn(infoItemIconVariants({ layout }))} />
        {layout === "stack" ? (
          <Label
            className={cn(infoItemValueVariants({ layout }), valueClassName)}
          >
            {value}
          </Label>
        ) : (
          <div className="flex items-baseline gap-1">
            <Label
              className={cn(infoItemValueVariants({ layout }), valueClassName)}
            >
              {value}
            </Label>
            {unit && (
              <Label className="text-muted-foreground text-sm font-normal">
                {unit}
              </Label>
            )}
          </div>
        )}
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <Label className="text-sm font-normal">{label}</Label>
    </TooltipContent>
  </Tooltip>
);
