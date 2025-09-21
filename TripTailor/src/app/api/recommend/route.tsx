// app/api/places/route.ts
import { NextResponse } from "next/server";

// Haversine formula to calculate distance between two coordinates
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function POST(req: Request) {
  try {
    const { budget, maxDistance, userLat, userLon } = await req.json();

    if (!budget || !maxDistance || !userLat || !userLon) {
      return NextResponse.json(
        { error: "Budget, maxDistance, userLat, and userLon are required" },
        { status: 400 }
      );
    }

    // Fetch tourist attractions from Overpass API (use large search radius first)
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["tourism"="attraction"](around:${maxDistance * 1000},${userLat},${userLon});out;`;

    const response = await fetch(overpassUrl);
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = (await response.json()) as { elements: any[] };
    console.log("Overpass API response status:", data);

    if (!data.elements || data.elements.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Pricing configuration (you can enhance later by transport type)
    const baseFare = 100; // flat fee
    const costPerKm = 1.2; // cost per km

    // Map Overpass data → calculate distance + travel cost
    const places = data.elements.map((place: any) => {
      const distance = haversineDistance(userLat, userLon, place.lat, place.lon);
      const cost = baseFare + distance * costPerKm;
      return {
        name: place.tags?.name || "Unknown",
        lat: place.lat,
        lon: place.lon,
        distance: parseFloat(distance.toFixed(2)),
        cost: parseFloat(cost.toFixed(2)),
      };
    });

    // Filter by budget + distance
    const suggestions = places
      .filter((place) => place.cost <= budget && place.distance <= maxDistance)
      .sort((a, b) => a.cost - b.cost || a.distance - b.distance)
      .slice(0, 10);

    return NextResponse.json(suggestions, { status: 200 });
  } catch (error) {
    console.error("❌ Recommendation API error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
