"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPlatters } from "@/lib/firebase";
import { useApp } from "@/context/AppContext";
import { Users, Info, Plus } from "lucide-react";

export default function PlattersPage() {
  const { addToCart } = useApp();
  const [platters, setPlatters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
            {platters.map((platter) => (
              <div
                key={platter.id}
                className="bg-dark-card border border-gold-400/15 rounded-sm overflow-hidden flex flex-col justify-between hover:border-gold-400 transition-luxury group"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden border-b border-gold-400/10">
                    <img
                      src={platter.image}
                      alt={platter.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-luxury duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
                    
                    {platter.servingSize && (
                      <span className="absolute bottom-4 left-4 bg-gold-400 text-dark-base text-[10px] font-bold uppercase tracking-widest px-3 py-1 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        Ideal for: {platter.servingSize}
                      </span>
                    )}
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-serif text-2xl font-bold text-gold-400 tracking-wide">{platter.name}</h3>
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
                    onClick={() => addToCart(platter)}
                    className="w-full py-3 bg-gold-400 hover:bg-transparent text-dark-base hover:text-gold-400 border border-gold-400 text-xs font-bold uppercase tracking-widest transition-luxury flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Select for Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

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
