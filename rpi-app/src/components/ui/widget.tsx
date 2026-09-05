import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const widgetVariants = cva(
  "relative flex size-full flex-col border-2 whitespace-nowrap shadow-md dark:shadow-secondary/50 rounded-3xl",
  {
    variants: {
      // La taille réelle est dictée par la cellule de grille qui contient le
      // widget (voir widgetDefaults dans lib/types.ts) — ce variant n'existe
      // que pour la compatibilité des call sites WigggleUI (`size="md"`).
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      design: {
        default: "p-6",
        mumbai: "p-4",
      },
      variant: {
        default: "bg-background text-foreground",
        secondary: "bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      size: "sm",
      design: "default",
      variant: "default",
    },
  },
);

export interface WidgetProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof widgetVariants> {
  asChild?: boolean;
}

const Widget = React.forwardRef<HTMLDivElement, WidgetProps>(
  ({ className, size, design, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(widgetVariants({ size, design, variant, className }))}
      {...props}
    />
  ),
);
Widget.displayName = "Widget";

const WidgetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-semibold flex flex-none items-start justify-between",
      className,
    )}
    {...props}
  />
));
WidgetHeader.displayName = "WidgetHeader";

const WidgetTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("leading-none font-semibold tracking-tight", className)}
    {...props}
  />
));
WidgetTitle.displayName = "WidgetTitle";

const WidgetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 items-center justify-center", className)}
    {...props}
  />
));
WidgetContent.displayName = "WidgetContent";

const WidgetFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-none items-center justify-between", className)}
    {...props}
  />
));
WidgetFooter.displayName = "WidgetFooter";

export {
  Widget,
  WidgetHeader,
  WidgetTitle,
  WidgetContent,
  WidgetFooter,
  widgetVariants,
};
