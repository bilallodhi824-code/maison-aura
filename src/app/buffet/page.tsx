"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBuffetPackages, getMenuItems } from "@/lib/firebase";
import { Clock, Award, Star } from "lucide-react";
import { BuffetPackage, MenuItem } from "@/types";

export default function BuffetPage() {
  const [packages, setPackages] = useState<BuffetPackage[]>([]);
  const [buffetDishes, setBuffetDishes] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBuffets() {
      setLoading(true);
      try {
        const p = await getBuffetPackages();
        setPackages(p.filter(item => item.active));

        const menuItems = await getMenuItems();
        setBuffetDishes(menuItems.filter(item => item.buffetAvailabilityFlag));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBuffets();
  }, []);

  return (
    <div className="min-h-screen bg-dark-base flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="relative py-20 flex items-center justify-center bg-dark-card border-b border-gold-400/10">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.04]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1200')" }} />
        <div className="relative z-10 text-center space-y-3 max-w-3xl mx-auto px-4">
          <span className="text-gold-400 text-xs uppercase tracking-[0.4em] block font-semibold">Gourmet Rituals</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide">The Grand Buffet Experience</h1>
          <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-3" />
        </div>
      </section>

      {loading ? (
        <div className="flex-1 py-24 text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-sm text-gold-400 tracking-wider">Arranging Buffet Stations...</p>
        </div>
      ) : (
        <div className="flex-1 space-y-24 py-16">
          {/* Buffet packages comparison */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {packages.map((pack) => (
                <div
                  key={pack.id}
                  className="bg-dark-card border border-gold-400/10 rounded-sm overflow-hidden flex flex-col justify-between hover:border-gold-400/35 transition-luxury group"
                >
                  <div>
                    {pack.image && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={pack.image}
                          alt={pack.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-luxury duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
                      </div>
                    )}
                    <div className="p-8 space-y-6">
                      <div className="space-y-2">
                        <h3 className="font-serif text-2xl font-bold text-gold-400">{pack.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                          <span>{pack.timings}</span>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-2 border-y border-gold-400/10 py-4">
                        <span className="text-3xl font-serif font-bold text-gold-400">${pack.price}</span>
                        <span className="text-xs text-gray-500">per person (net value)</span>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-widest text-gold-500 font-semibold">Offerings Included:</p>
                        <ul className="space-y-2">
                          {pack.inclusions?.map((inc: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                              <Star className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 pt-0">
                    <Link
                      href={`/reserve?type=Buffet%20Experience&package=${encodeURIComponent(pack.name)}`}
                      className="w-full py-3 bg-gold-400 hover:bg-transparent text-dark-base hover:text-gold-400 border border-gold-400 text-xs font-bold uppercase tracking-widest text-center transition-luxury block"
                    >
                      Book Buffet Spot
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured buffet dishes section */}
          <section className="bg-dark-card py-24 border-y border-gold-400/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
              <div className="text-center space-y-4">
                <span className="text-gold-400 text-xs uppercase tracking-[0.3em] block">Taste Previews</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold">Featured Buffet Inclusions</h2>
                <div className="w-12 h-[1px] bg-gold-400 mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {buffetDishes.slice(0, 8).map((dish) => (
                  <div key={dish.id} className="bg-dark-base border border-gold-400/5 hover:border-gold-400/20 p-4 rounded transition-luxury flex items-center gap-4">
                    {dish.image && (
                      <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded border border-gold-400/10">
                        <Image src={dish.image} alt={dish.name} fill sizes="64px" className="object-cover" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-gold-400 leading-tight">{dish.name}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{dish.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Group booking CTA details */}
          <section className="max-w-4xl mx-auto px-4 text-center space-y-8">
            <div className="flex justify-center"><Award className="w-12 h-12 text-gold-400/30" /></div>
            <h2 className="font-serif text-3xl font-bold text-gold-400">Corporate &amp; Grand Group Decorum</h2>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              Are you scheduling a private corporate dinner, wedding gala, or family reunion of 15 or more delegates? Maison Aura offers premium dining hall reservations, custom dessert plattings, and custom buffet timings.
            </p>
            <div className="pt-4 flex justify-center gap-4 flex-wrap">
              <Link
                href="/private-events"
                className="px-8 py-3.5 bg-transparent hover:bg-gold-400 border border-gold-400 text-gold-400 hover:text-dark-base text-xs font-bold uppercase tracking-widest transition-luxury"
              >
                Inquire Private Event
              </Link>
            </div>
          </section>
        </div>
      )}

      <Footer />
    </div>
  );
}
