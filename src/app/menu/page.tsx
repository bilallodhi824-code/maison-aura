"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMenuItems, DEFAULT_MENU_ITEMS } from "@/lib/firebase";
import { useApp } from "@/context/AppContext";
import { Search, Flame, Award, HelpCircle } from "lucide-react";

function MenuContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");

  const { addToCart } = useApp();
  const [items, setItems] = useState<any[]>(DEFAULT_MENU_ITEMS);
  const [filteredItems, setFilteredItems] = useState<any[]>(DEFAULT_MENU_ITEMS);
  const [categories, setCategories] = useState<string[]>(["All", ...Array.from(new Set(DEFAULT_MENU_ITEMS.map((i: any) => i.category)))]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadMenu() {
      try {
        const menu = await getMenuItems();
        setItems(menu);
        
        // Extract unique categories
        const cats = ["All", ...Array.from(new Set(menu.map((i: any) => i.category)))];
        setCategories(cats);

        // Check query param
        if (catParam && cats.includes(catParam)) {
          setActiveCategory(catParam);
        }
      } catch (err) {
        console.error("Failed to load menu items", err);
      }
    }
    loadMenu();
  }, [catParam]);

  // Apply filters
  useEffect(() => {
    let result = items;

    if (activeCategory !== "All") {
      result = result.filter(item => item.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.name.toLowerCase().includes(query) || 
          item.shortDescription.toLowerCase().includes(query)
      );
    }

    setFilteredItems(result);
  }, [activeCategory, searchQuery, items]);

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Search and Category Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gold-400/10 pb-8">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 border rounded text-xs uppercase tracking-widest transition-luxury cursor-pointer ${
                activeCategory === cat
                  ? "bg-gold-400 border-gold-400 text-dark-base font-bold"
                  : "bg-dark-card border-gold-400/15 text-gray-400 hover:border-gold-400 hover:text-gold-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search gourmets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-card border border-gold-400/15 focus:border-gold-400 rounded outline-none py-2.5 pl-10 pr-4 text-xs text-[#FAF9F6] transition-luxury"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-sm text-gold-400 tracking-wider">Unveiling the Gastronomy Board...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <HelpCircle className="w-16 h-16 text-gold-400/20 mx-auto" />
          <p className="font-serif text-lg text-gray-400">No delicacies match your filters</p>
          <button 
            onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
            className="text-xs uppercase tracking-widest text-gold-400 border-b border-gold-400 hover:text-gold-300 pb-0.5"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const isChefSpecial = item.tags?.includes("chef special");
            const isSpicy = item.tags?.includes("spicy");
            return (
              <div
                key={item.id}
                className="group bg-dark-card border border-gold-400/10 rounded-sm overflow-hidden flex flex-col justify-between hover:border-gold-400/25 transition-luxury hover:shadow-2xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-luxury duration-700"
                  />
                  {/* Badge Row */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {isChefSpecial && (
                      <span className="bg-gold-400 text-dark-base text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1 rounded-sm shadow">
                        <Award className="w-3 h-3" /> Chef Special
                      </span>
                    )}
                    {isSpicy && (
                      <span className="bg-red-500 text-white text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 flex items-center gap-0.5 rounded-sm shadow">
                        <Flame className="w-3 h-3" /> Spicy
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-serif text-base font-semibold text-gold-400 tracking-wide group-hover:text-gold-300 leading-tight">
                        {item.name}
                      </h3>
                      <span className="font-serif text-base font-bold text-gold-400 shrink-0">${item.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-light line-clamp-3">
                      {item.longDescription || item.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full py-2 bg-transparent hover:bg-gold-400 border border-gold-400/30 hover:border-gold-400 text-gold-400 hover:text-dark-base text-[10px] font-bold uppercase tracking-widest transition-luxury cursor-pointer"
                    >
                      Select to Pre-Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-dark-base flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="relative py-20 flex items-center justify-center bg-dark-card border-b border-gold-400/10">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547928576-a4a3323d8b36?q=80&w=1200')" }} />
        <div className="relative z-10 text-center space-y-3 max-w-3xl mx-auto px-4">
          <span className="text-gold-400 text-xs uppercase tracking-[0.4em] block font-semibold">The Gastronomy Board</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide">Signature Masterpieces</h1>
          <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-3" />
        </div>
      </section>

      {/* Filterable Menu Section with Suspense Wrapper */}
      <Suspense fallback={
        <div className="flex-1 py-24 text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-sm text-gold-400 tracking-wider">Unveiling the Gastronomy Board...</p>
        </div>
      }>
        <MenuContent />
      </Suspense>

      <Footer />
    </div>
  );
}
