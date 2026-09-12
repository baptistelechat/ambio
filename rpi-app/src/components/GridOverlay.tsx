import { CELL_HEIGHT, CELL_WIDTH, GRID_PADDING } from "@/lib/types";

export const GridOverlay = () => (
  <div
    className="pointer-events-none absolute"
    style={{
      inset: GRID_PADDING,
      // Traits à 3px (espace canvas non mis à l'échelle) pour rester
      // visibles une fois réduits par le `transform: scale()` du
      // conteneur — à 1px ils disparaissent en sous-pixel.
      backgroundImage:
        "linear-gradient(to right, rgba(255,255,255,0.8) 3px, transparent 3px), linear-gradient(to bottom, rgba(255,255,255,0.8) 3px, transparent 3px)",
      backgroundSize: `${CELL_WIDTH}px ${CELL_HEIGHT}px`,
      // Le motif tuilé ne dessine un trait qu'au DÉBUT de chaque
      // cellule : la dernière colonne/ligne n'a donc jamais son trait
      // de droite/bas. On le complète avec un box-shadow interne.
      boxShadow:
        "inset -3px 0 0 rgba(255,255,255,0.8), inset 0 -3px 0 rgba(255,255,255,0.8)",
    }}
  />
);
