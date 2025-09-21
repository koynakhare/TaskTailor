"use client";

import { useState } from "react";

export default function TestRecommendation() {
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setError("");
    setResults([]);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        try {
          const res = await fetch("/api/recommend", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              budget: 12000,
              maxDistance: 1000,
              userLat: 24.916355,
              userLon: 79.581184,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            setError(data.error || "Failed to fetch recommendations.");
            setResults([]);
          } else {
            setResults(data);
          }
        } catch (err) {
          setError("Failed to fetch data");
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setError("Failed to get location: " + geoError.message);
        setLoading(false);
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Travel Recommendations
      </h1>

      <div className="text-center mb-6">
        <button
          onClick={handleClick}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Get Recommendations"}
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((item: any, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow bg-white"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {item.name}
            </h2>
            <p className="text-gray-600">Cost: {item.cost}</p>
            <p className="text-gray-600">
              Distance: {item.distance.toFixed(2)} km
            </p>
          </div>
        ))}
      </div>

      {results.length === 0 && !loading && !error && (
        <p className="text-gray-500 text-center mt-4">No recommendations yet.</p>
      )}
    </div>
  );
}
