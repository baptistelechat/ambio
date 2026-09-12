// Échelle European AQI officielle (0-100+, seuils Open-Meteo).
export const getAqiLevel = (aqi: number) => {
  if (aqi <= 20) return { label: "Bon", colorClass: "text-green-500" };
  if (aqi <= 40) return { label: "Moyen", colorClass: "text-yellow-500" };
  if (aqi <= 60) return { label: "Dégradé", colorClass: "text-orange-500" };
  if (aqi <= 80) return { label: "Mauvais", colorClass: "text-red-500" };
  return { label: "Très mauvais", colorClass: "text-purple-500" };
};

export const getPollenLevel = (pollenMax: number) => {
  if (pollenMax < 10) return "Faible";
  if (pollenMax < 50) return "Modéré";
  return "Élevé";
};
