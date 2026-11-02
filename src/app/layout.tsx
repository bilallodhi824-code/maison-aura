import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Maison Aura | Luxury Fine Dining & Restaurant Mansion",
  description: "Experience the ultimate culinary artistry at Maison Aura. Offering premium steaks, authentic gourmet ramen, signature seafood platters, and a luxurious buffet experience.",
  keywords: ["luxury dining", "fine dining", "steakhouse", "ramen lounge", "seafood platter", "premium buffet", "Maison Aura"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full bg-dark-base text-[#FAF9F6] font-sans flex flex-col selection:bg-gold-400 selection:text-dark-base">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
