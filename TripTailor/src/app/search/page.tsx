"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const importDestinations = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/destination", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Destinations imported successfully!");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to fetch destinations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1350&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=600&q=80"
          alt="Destinations"
          style={{ width: "80px", marginBottom: "20px" }}
        />

        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px", color: "#333" }}>
          Import Destinations
        </h1>

        <p style={{ fontSize: "1rem", marginBottom: "30px", color: "#555" }}>
          Click the button below to import all cities and start exploring!
        </p>

        <button
          onClick={importDestinations}
          disabled={loading}
          style={{
            padding: "12px 25px",
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
        >
          {loading ? "Importing..." : "Import All Cities"}
        </button>

        {message && (
          <p style={{ marginTop: "20px", color: "green", fontWeight: "bold" }}>{message}</p>
        )}

        {error && (
          <p style={{ marginTop: "20px", color: "red", fontWeight: "bold" }}>{error}</p>
        )}
      </div>
    </div>
  );
}
