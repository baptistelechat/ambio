const geocodeCache = new Map<string, { lat: number; lon: number }>();

export const geocode = async (location: string) => {
  const cached = geocodeCache.get(location);
  if (cached) return cached;
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=fr`,
  );
  const data = (await res.json()) as {
    results?: { latitude: number; longitude: number }[];
  };
  const first = data.results?.[0];
  if (!first) throw new Error(`Location introuvable: ${location}`);
  const coords = { lat: first.latitude, lon: first.longitude };
  geocodeCache.set(location, coords);
  return coords;
};
