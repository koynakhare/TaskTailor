// app/api/destinations/route.ts (Next.js 13+ API route)
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Destination from "@/models/destination";
import axios from "axios";
const RAPIDAPI_HOST = "travel-advisor.p.rapidapi.com";
const RAPIDAPI_KEY = 'e3335d9a87msh17df463f4d5d49fp1165acjsn3d8def18bb62'; // store your key in .env

// Fetch city coordinates dynamically
async function fetchCityCoordinates(city: string) {
  const apiKey = process.env.OPENCAGE_API_KEY!;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${apiKey}`;

  const response = await axios.get(url);
  const result = response.data.results[0];

  if (!result) throw new Error("City not found");

  return {
    latitude: result.geometry.lat,
    longitude: result.geometry.lng,
  };
}


// Fetch nearby destinations using coordinates
async function fetchDestinationsFromAPI(latitude: number, longitude: number) {
  const options = {
    method: "POST",
    url: `https://${RAPIDAPI_HOST}/answers/v2/list-nearby`,
    headers: {
      "X-RapidAPI-Key": RAPIDAPI_KEY,
      "X-RapidAPI-Host": RAPIDAPI_HOST,
      "Content-Type": "application/json",
    },
    data: {
      contentId: "cc8fc7b8-88ed-47d3-a70e-0de9991f6604",
      contentType: "restaurant",
      filters: [
        { id: "placetype", value: ["hotel", "attraction", "restaurant"] },
        { id: "minRating", value: ["30"] },
      ],
      boundingBox: {
        northEastCorner: { latitude: latitude + 0.01, longitude: longitude + 0.01 },
        southWestCorner: { latitude: latitude - 0.01, longitude: longitude - 0.01 },
      },
    },
  };

  const response = await axios.request(options);
console.log(response.data);
  return response.data.data.map((d: any) => ({
    name: d.result_object.name,
    country: d.result_object.address_obj?.country || "Unknown",
    type: d.result_object.subcategory?.[0]?.name || "Unknown",
    latitude: d.result_object.latitude,
    longitude: d.result_object.longitude,
    rating: d.result_object.rating,
  }));
}

// API POST handler
export async function POST(req: NextRequest) {
  try {
    // await connectDB();

    // const { city } = await req.json();
    // if (!city) return NextResponse.json({ error: "City is required" }, { status: 400 });

    const { latitude, longitude } = await fetchCityCoordinates('mumbai')||{};
    const apiData = await fetchDestinationsFromAPI(latitude, longitude);

    for (const dest of apiData) {
      const exists = await Destination.findOne({ name: dest.name, country: dest.country });
      if (!exists) await Destination.create(dest);
    }

    return NextResponse.json({ message: `${apiData.length} destinations fetched & saved!` });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to fetch destinations" }, { status: 500 });
  }
}
