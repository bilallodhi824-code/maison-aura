"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPlatters } from "@/lib/firebase";
import { useApp } from "@/context/AppContext";
import { Users, Info, Plus, Check, X } from "lucide-react";
import { MenuItem } from "@/types";

export default function PlattersPage() {
  const { addToCart } = useApp();
  const [platters, setPlatters] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedPlatter, setSelectedPlatter] = useState<MenuItem | null>(null);

  const handleAddToCart = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    addToCart(item);
    setAddedId(item.id);
    setTimeout(() => {
      setAddedId((curr) => (curr === item.id ? null : curr));
    }, 1500);
  };

  useEffect(() => {
    async function loadPlatters() {
      setLoading(true);
      try {
        const p = await getPlatters();
        setPlatters(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPlatters();
  }, []);

  return (
    <div className="min-h-screen bg-dark-base flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="relative py-20 flex items-center justify-center bg-dark-card border-b border-gold-400/10">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200')" }} />
        <div className="relative z-10 text-center space-y-3 max-w-3xl mx-auto px-4">
          <span className="text-gold-400 text-xs uppercase tracking-[0.4em] block font-semibold">Communal Decorum</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide">Sharing Platters &amp; Feasts</h1>
          <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-3" />
        </div>
      </section>

      {loading ? (
        <div className="flex-1 py-24 text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-sm text-gold-400 tracking-wider">Presenting the Sharing Platters...</p>
        </div>
      ) : (
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {platters.map((platter) => {
              const isAdded = addedId === platter.id;
              return (
                <div
                  key={platter.id}
                  onClick={() => setSelectedPlatter(platter)}
                  className="bg-dark-card border border-gold-400/15 rounded-sm overflow-hidden flex flex-col justify-between hover:border-gold-400 transition-luxury group cursor-pointer"
                >
                  <div>
                    <div className="relative aspect-video overflow-hidden border-b border-gold-400/10">
                      <Image
                        src={platter.image}
                        alt={platter.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-luxury duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
                      
                      {platter.servingSize && (
                        <span className="absolute bottom-4 left-4 bg-gold-400 text-dark-base text-[10px] font-bold uppercase tracking-widest px-3 py-1 flex items-center gap-1 shadow">
                          <Users className="w-3.5 h-3.5" />
                          Ideal for: {platter.servingSize}
                        </span>
                      )}
                    </div>

                    <div className="p-8 space-y-6">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-serif text-2xl font-bold text-gold-400 tracking-wide group-hover:text-gold-300">
                          {platter.name}
                        </h3>
                        <span className="font-serif text-2xl font-bold text-gold-400">${platter.price}</span>
                      </div>

                      <p className="text-xs text-gray-400 leading-relaxed font-light">
                        {platter.longDescription || platter.shortDescription}
                      </p>

                      {platter.ingredients && platter.ingredients.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase tracking-widest text-gold-500 font-semibold flex items-center gap-1">
                            <Info className="w-3.5 h-3.5" /> Items Included
                          </p>
                          <p className="text-xs text-gray-500 font-light leading-relaxed">
                            {platter.ingredients.join(" • ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-8 pt-0">
                    <button
                      onClick={(e) => handleAddToCart(e, platter)}
                      className={`w-full py-3.5 border text-xs font-bold uppercase tracking-widest transition-luxury flex items-center justify-center gap-2 cursor-pointer ${
                        isAdded
                          ? "bg-gold-400 border-gold-400 text-dark-base font-extrabold"
                          : "bg-gold-400 hover:bg-transparent text-dark-base hover:text-gold-400 border-gold-400"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Pre-Order Selection ✓</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Select for Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Platter Modal */}
          {selectedPlatter && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
              onClick={() => setSelectedPlatter(null)}
            >
              <div
                className="relative w-full max-w-2xl bg-dark-card border border-gold-400/30 rounded-sm overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedPlatter(null)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-dark-base/80 border border-gold-400/30 text-gold-400 hover:text-[#FAF9F6] hover:border-gold-400 flex items-center justify-center transition-luxury cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="relative aspect-video w-full overflow-hidden border-b border-gold-400/15">
                  <Image
                    src={selectedPlatter.image}
                    alt={selectedPlatter.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 672px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />
                  {selectedPlatter.servingSize && (
                    <span className="absolute bottom-4 left-4 bg-gold-400 text-dark-base text-[10px] font-bold uppercase tracking-widest px-3 py-1 flex items-center gap-1 shadow">
                      <Users className="w-3.5 h-3.5" />
                      Ideal for: {selectedPlatter.servingSize}
                    </span>
                  )}
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gold-400 tracking-wide">
                        {selectedPlatter.name}
                      </h2>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
                        Communal Decorum Feasts
                      </p>
                    </div>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-400 shrink-0">
                      ${selectedPlatter.price}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed font-light">
                    {selectedPlatter.longDescription || selectedPlatter.shortDescription}
                  </p>

                  {selectedPlatter.ingredients && selectedPlatter.ingredients.length > 0 && (
                    <div className="space-y-2 border-t border-gold-400/10 pt-4">
                      <h4 className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold">
                        Elements &amp; Portions Included
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlatter.ingredients.map((ing, i) => (
                          <span
                            key={i}
                            className="text-xs text-gray-300 bg-dark-base px-2.5 py-1 border border-gold-400/15 rounded-sm"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={(e) => handleAddToCart(e, selectedPlatter)}
                      className={`flex-1 py-3.5 border text-xs font-bold uppercase tracking-widest transition-luxury cursor-pointer flex items-center justify-center gap-2 ${
                        addedId === selectedPlatter.id
                          ? "bg-gold-400 border-gold-400 text-dark-base font-extrabold"
                          : "bg-gold-400 hover:bg-transparent text-dark-base hover:text-gold-400 border-gold-400"
                      }`}
                    >
                      {addedId === selectedPlatter.id ? (
                        <>
                          <Check className="w-4 h-4" /> Added to Pre-Order Selection ✓
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Select for Order
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedPlatter(null)}
                      className="py-3.5 px-6 bg-transparent hover:bg-white/5 border border-gold-400/20 text-gray-400 hover:text-[#FAF9F6] text-xs font-semibold uppercase tracking-widest transition-luxury cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Guidelines */}
          <div className="max-w-3xl mx-auto glass-panel p-8 rounded-sm space-y-4 border border-gold-400/20 text-center">
            <h4 className="font-serif text-base text-gold-400 uppercase tracking-widest font-semibold">Important Culinary Note</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sharing platters require fresh ingredients prepared custom for your party size. Pre-ordering items at least 2 hours prior to arrival ensures perfect serving times and zero delays. Add platters to your selection and link them when submitting your table booking.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
