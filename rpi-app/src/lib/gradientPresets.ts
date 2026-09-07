export interface GradientPreset {
  id: string;
  label: string;
  color1: string;
  color2: string;
  color3: string;
}

// Chaque preset suit la structure du shader Grainient (couleur claire /
// couleur d'accent / couleur profonde) pour rester harmonieux à l'écran.
export const gradientPresets: GradientPreset[] = [
  {
    id: "aurora",
    label: "Aurore",
    color1: "#7DE2D1",
    color2: "#3A86FF",
    color3: "#131A2B",
  },
  {
    id: "sunset",
    label: "Coucher de soleil",
    color1: "#FFD59E",
    color2: "#FF6B6B",
    color3: "#3A1435",
  },
  {
    id: "nebula",
    label: "Nébuleuse",
    color1: "#C9A9FF",
    color2: "#5227FF",
    color3: "#150C28",
  },
  {
    id: "ocean",
    label: "Océan",
    color1: "#8FE3EF",
    color2: "#1D6FA5",
    color3: "#0A2233",
  },
  {
    id: "ember",
    label: "Braise",
    color1: "#FFB37B",
    color2: "#E4572E",
    color3: "#26090A",
  },
  {
    id: "forest",
    label: "Forêt",
    color1: "#C6E6A2",
    color2: "#3E8E5A",
    color3: "#0E2A1B",
  },
  {
    id: "midnight",
    label: "Minuit",
    color1: "#4C6EF5",
    color2: "#22223B",
    color3: "#0B0B14",
  },
  {
    id: "candy",
    label: "Bonbon",
    color1: "#FF9FFC",
    color2: "#5227FF",
    color3: "#B497CF",
  },
];

export const DEFAULT_GRADIENT_PRESET = gradientPresets[0].id;

export const getGradientPreset = (id: string | undefined): GradientPreset =>
  gradientPresets.find((preset) => preset.id === id) ?? gradientPresets[0];
