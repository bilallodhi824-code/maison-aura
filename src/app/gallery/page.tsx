"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  const categories = ["All", "Gastronomy", "Ambiance", "Buffet & Platters"];

  const items = [
    { title: "Wagyu Ribeye Steak", cat: "Gastronomy", img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200" },
    { title: "Signature Beef Ramen", cat: "Gastronomy", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1200" },
    { title: "Grand Seafood Platter", cat: "Buffet & Platters", img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1200" },
    { title: "Velvet Booths & Lighting", cat: "Ambiance", img: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=1200" },
    { title: "Main Dining Hall", cat: "Ambiance", img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200" },
    { title: "Premium Desserts Bar", cat: "Gastronomy", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200" },
    { title: "Weekend Buffet Setup", cat: "Buffet & Platters", img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1200" },
    { title: "Gourmet Starter Display", cat: "Buffet & Platters", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1200" }
  ];

  const filtered = filter === "All" ? items : items.filter(i => i.cat === filter);

  const handleNext = useCallback(() => {
    setActiveModalIndex((prev) => (prev === null ? null : (prev + 1) % filtered.length));
  }, [filtered.length]);

  const handlePrev = useCallback(() => {
    setActiveModalIndex((prev) => (prev === null ? null : (prev - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalIndex === null) return;
      if (e.key === "Escape") setActiveModalIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModalIndex, handleNext, handlePrev]);

  return (
    <div className="min-h-screen bg-dark-base flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="relative py-20 flex items-center justify-center bg-dark-card border-b border-gold-400/10">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=1200')" }} />
        <div className="relative z-10 text-center space-y-3 max-w-3xl mx-auto px-4">
          <span className="text-gold-400 text-xs uppercase tracking-[0.4em] block font-semibold">Visual Theatre</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide">The Culinary Canvas</h1>
          <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-3" />
        </div>
      </section>

      {/* Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Filters */}
        <div className="flex justify-center items-center gap-3 flex-wrap border-b border-gold-400/10 pb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setFilter(c);
                setActiveModalIndex(null);
              }}
              className={`px-5 py-2 border rounded text-xs uppercase tracking-widest transition-luxury cursor-pointer ${
                filter === c
                  ? "bg-gold-400 border-gold-400 text-dark-base font-bold"
                  : "bg-dark-card border-gold-400/15 text-gray-400 hover:border-gold-400 hover:text-gold-400"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setActiveModalIndex(idx)}
              className="group relative aspect-square overflow-hidden border border-gold-400/10 rounded-sm hover:border-gold-400 transition-luxury cursor-pointer"
            >
              <Image
                src={item.img}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-luxury duration-700 filter brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/40 to-transparent opacity-0 group-hover:opacity-100 transition-luxury" />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-luxury">
                <span className="p-1.5 rounded-full bg-dark-base/80 border border-gold-400/30 text-gold-400 flex items-center justify-center">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-center opacity-0 group-hover:opacity-100 transition-luxury space-y-1">
                <h4 className="font-serif text-sm font-semibold text-gold-400">{item.title}</h4>
                <p className="text-[9px] uppercase tracking-widest text-gray-400">{item.cat}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeModalIndex !== null && filtered[activeModalIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md"
          onClick={() => setActiveModalIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setActiveModalIndex(null)}
            className="absolute top-6 right-6 z-50 p-2 rounded-full bg-dark-base/80 border border-gold-400/30 text-gold-400 hover:text-white hover:border-gold-400 transition-luxury cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 sm:left-8 z-50 p-3 rounded-full bg-dark-base/80 border border-gold-400/30 text-gold-400 hover:text-white hover:border-gold-400 transition-luxury cursor-pointer"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 sm:right-8 z-50 p-3 rounded-full bg-dark-base/80 border border-gold-400/30 text-gold-400 hover:text-white hover:border-gold-400 transition-luxury cursor-pointer"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Content Container */}
          <div
            className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[70vh] rounded-sm overflow-hidden border border-gold-400/25 shadow-2xl">
              <Image
                src={filtered[activeModalIndex].img}
                alt={filtered[activeModalIndex].title}
                fill
                sizes="(max-width: 1200px) 100vw, 1000px"
                className="object-cover"
                priority
              />
            </div>

            <div className="mt-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold border border-gold-400/30 px-2.5 py-0.5 rounded-sm">
                  {filtered[activeModalIndex].cat}
                </span>
                <span className="text-xs text-gray-400 font-serif">
                  {activeModalIndex + 1} / {filtered.length}
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF9F6] tracking-wide">
                {filtered[activeModalIndex].title}
              </h3>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
