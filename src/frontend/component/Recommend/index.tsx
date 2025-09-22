"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import FormField from "../form/renderField";

 const Recommendation=() =>{
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    mood: "Relaxing",
    budget: 10000,
    maxDistance: 500,
  });

  const handleChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...filters,
              userLat,
              userLon,
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

  const inputFields = [
    // {
    //   key: "mood",
    //   label: "Mood",
    //   type: "select" as const,
    //   options: ["Relaxing", "Adventure", "Nature", "Historical", "Romantic"],
    // },
    { key: "budget", label: "Budget (₹)", type: "number" as const, min: 1000 },
    {
      key: "maxDistance",
      label: "Max Distance (km)",
      type: "number" as const,
      min: 10,
    },
  ];

  return (
    <div className=" mx-auto p-2">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Travel Recommendations
      </h1>

      {/* Inputs Section */}
      <div className="max-w-2xl mx-auto  grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {inputFields.map((field) => (
          <FormField
            key={field.key}
            field={field}
            value={filters[field.key as keyof typeof filters]}
            onChange={handleChange}
          />
        ))}
      </div>

      {/* Button */}
      <div className="text-center mb-6">
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Recommendations"}
        </Button>
      </div>

      {error && (
        <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
      )}

      {/* Results */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {results.map((item: any, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow bg-white"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {item.name}
            </h2>
            <p className="text-gray-600">Cost: ₹{item.cost}</p>
            <p className="text-gray-600">
              Distance: {item.distance.toFixed(2)} km
            </p>
            {/* <p className="text-gray-600">Mood: {item.mood}</p> */}
          </div>
        ))}
      </div>

      {results.length === 0 && !loading && !error && (
        <p className="text-gray-500 text-center mt-4">No recommendations yet.</p>
      )}
    </div>
  );
}

export default Recommendation