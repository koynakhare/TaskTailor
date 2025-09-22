import { Place, PlaceRequest } from "../types/place";
import { haversineDistance } from "../utils/helper";

const BASE_FARE = 100;
const COST_PER_KM = 1.2;

export const fetchPlaces = async ({ budget, maxDistance, userLat, userLon, mood }: PlaceRequest): Promise<Place[]> => {
  const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["tourism"="attraction"](around:${
    maxDistance * 1000
  },${userLat},${userLon});out;`;

  const response = await fetch(overpassUrl);
  if (!response.ok) throw new Error(`Overpass API error: ${response.status}`);

  const data: { elements: any[] } = await response.json();
  if (!data.elements?.length) return [];
  return data.elements
    .map((place) => {
      const distance = haversineDistance(userLat, userLon, place.lat, place.lon);
      const cost = BASE_FARE + distance * COST_PER_KM;
      return {
        name: place.tags?.name || "Unknown",
        lat: place.lat,
        lon: place.lon,
        distance: parseFloat(distance.toFixed(2)),
        cost: parseFloat(cost.toFixed(2)),
        mood: place.tags?.mood || "Relaxing",
      };
    })
    .filter(
      (place) =>
        place.cost <= budget &&
        place.distance <= maxDistance &&
        (!mood || place.mood.toLowerCase() === mood.toLowerCase())
    )
    .sort((a, b) => a.cost - b.cost || a.distance - b.distance)
    .slice(0, 10);
};
