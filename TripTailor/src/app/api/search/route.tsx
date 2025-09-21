import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { budget, distance, interest } = body;

  // Mock data for now
  const destinations = [
    { name: "Lonavala", cost: 6500, distance: 95, category: "nature" },
    { name: "Goa", cost: 12000, distance: 450, category: "beach" },
    { name: "Mahabaleshwar", cost: 7800, distance: 145, category: "nature" },
  ];

  // Filter logic
  const filtered = destinations.filter(
    (d) => d.cost <= budget && d.distance <= distance && d.category === interest
  );

  return NextResponse.json({ results: filtered });
}
