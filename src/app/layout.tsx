import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel Dashboard",
  description: "Explore and import destinations with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #6B73FF 0%, #ffa600ff 100%)",
          color: "#fff",
          fontFamily: "var(--font-geist-sans), sans-serif",
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: "20px 40px",
            backgroundColor: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(10px)",
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
            boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          }}
        >
          🌍 Travel Dashboard
        </header>

        {/* Main content */}
        <main
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          {children}
        </main>

        {/* Footer */}
        <footer
          style={{
            padding: "10px 20px",
            textAlign: "center",
            fontSize: "0.9rem",
            backgroundColor: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          © 2025 Travel Dashboard. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
