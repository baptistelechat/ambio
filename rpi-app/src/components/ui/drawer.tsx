import type * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

const Drawer = DrawerPrimitive.Root;
const DrawerPortal = DrawerPrimitive.Portal;

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        className={cn(
          // ponytail: `h-dvh` et NON `h-full` (= height:100%). Sur un
          // élément `position: fixed` sans `top`, un `height:100%` se
          // résout historiquement par rapport à la "large viewport" (celle
          // qui suppose la barre d'adresse mobile masquée), pas par rapport
          // à ce qui est RÉELLEMENT visible à l'écran. Sur desktop Chrome
          // (et son émulateur mobile), les deux coïncident quasiment — d'où
          // un résidu de ~2px invisible en test — mais sur un vrai
          // navigateur Android avec la barre d'adresse affichée, l'écart
          // atteint la hauteur de cette barre (~50-60px), largement de quoi
          // pousser tout le bas du tiroir (séparateur + bouton Publier) hors
          // de l'écran. `dvh` s'ajuste en temps réel à la barre d'adresse.
          //
          // `overflow-hidden` reste nécessaire : sans lui, un contenu
          // interne qui ne se contracte pas correctement (`min-h-0`
          // manquant quelque part dans la cascade flex) déborderait
          // visuellement hors de cette box au lieu de rester contenu dans
          // la `ScrollArea` interne. Ne pas remplacer par un `max-h` fixe :
          // vaul mesure la hauteur réelle de ce conteneur pour calculer ses
          // snapPoints, et la contraindre artificiellement casse ce calcul
          // (le tiroir disparaît entièrement).
          "fixed inset-x-0 bottom-0 z-50 flex h-dvh flex-col overflow-hidden rounded-t-lg border-t bg-background",
          className,
        )}
        {...props}
      >
        <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-muted-foreground/30" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

export { Drawer, DrawerContent, DrawerOverlay, DrawerPortal };
