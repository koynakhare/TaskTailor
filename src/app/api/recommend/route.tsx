import { NextResponse } from "next/server";
import { fetchPlaces } from "@/backend/services/place.services";
import { PlaceRequest } from "@/backend/types/place";

export async function POST(req: Request) {
  try {
    const body: PlaceRequest = await req.json();
    const { budget, maxDistance, userLat, userLon } = body;

    if (![budget, maxDistance, userLat, userLon].every(Boolean)) {
      return NextResponse.json(
        { error: "budget, maxDistance, userLat, and userLon are required" },
        { status: 400 }
      );
    }

    const suggestions = await fetchPlaces(body);
    return NextResponse.json(suggestions, { status: 200 });
  } catch (error) {
    console.error("❌ Recommendation API error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
