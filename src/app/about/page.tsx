"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Award, Compass, Heart, ShieldCheck, HeartHandshake } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-base flex flex-col">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative py-24 flex items-center justify-center bg-dark-card border-b border-gold-400/10">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.09]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200')" }} />
        <div className="relative z-10 text-center space-y-4 max-w-3xl mx-auto px-4">
          <span className="text-gold-400 text-xs uppercase tracking-[0.4em] block font-medium">Inside the Sanctuary</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-wide">Our Chronicle &amp; Spirit</h1>
          <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-4" />
        </div>
      </section>

      {/* Concept Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-gold-400 text-xs uppercase tracking-widest block font-semibold">The Genesis</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gold-400">Maison Aura</h2>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              Founded in 2012 by an alliance of passionate luxury hoteliers and master chefs, Maison Aura was conceived as an antidote to clinical, uninspired dining. We believed that fine food should be a multisensory theatrical performance.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              We selected the name &quot;Maison Aura&quot; to represent our promise: absolute precision in every seared meat fiber, perfect richness in every simmered broth drop, and unforgettable warmth in our hospitality.
            </p>
          </div>
          <div className="border border-gold-400/20 p-2.5 bg-dark-card rounded-sm">
            <img 
              src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop" 
              alt="Plating design" 
              className="w-full h-auto object-cover rounded-sm filter brightness-90 contrast-110"
            />
          </div>
        </div>
      </section>

      {/* Chef Philosophy */}
      <section className="py-24 bg-dark-card border-y border-gold-400/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="border border-gold-400/20 p-2.5 bg-dark-base rounded-sm order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop" 
                alt="Chef in deep thoughts" 
                className="w-full h-auto object-cover rounded-sm transition-luxury"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <span className="text-gold-400 text-xs uppercase tracking-widest block font-semibold">The Maestro</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gold-400">Claude Valois&apos; Philosophy</h2>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                &quot;Gastronomy is a fleeting sculpture. It is tasted, enjoyed, and becomes a treasured memory. My mission is to preserve the pristine structure of traditional French pan-searing and combine it with the intense, patient extraction of Japanese ramen and continental spices.&quot;
              </p>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                Every chef inside Maison Aura must complete six months of specialty training under Chef Valois to master our custom double-basted steak sealing, dry-aging checks, and slow seafood soup reductions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Noble Values */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
        <div className="space-y-4">
          <span className="text-gold-400 text-xs uppercase tracking-[0.3em] block">Our Moral Compass</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">The Pillars of Decorum</h2>
          <div className="w-12 h-[1px] bg-gold-400 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Compass className="w-8 h-8 text-gold-400" />,
              title: "Artisanal Sourcing",
              desc: "We exclusively purchase USDA prime beef from heritage farms, line-caught ocean salmon, and organic wheat flours.",
            },
            {
              icon: <HeartHandshake className="w-8 h-8 text-gold-400" />,
              title: "Impeccable Guest Service",
              desc: "Our Maître D' leads a group of dedicated hosts trained to anticipate guest requirements silently and respectfully.",
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-gold-400" />,
              title: "Culinary Purity",
              desc: "No chemical powders, preservatives, or artificial flavorings. Every stock is built from natural bones and real roots.",
            },
          ].map((val, idx) => (
            <div key={idx} className="p-8 bg-dark-card border border-gold-400/10 rounded-sm hover:border-gold-400/30 transition-luxury space-y-4">
              <div className="flex justify-center">{val.icon}</div>
              <h3 className="font-serif text-lg font-semibold text-gold-400 tracking-wide">{val.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ambiance Highlight */}
      <section className="relative py-32 bg-dark-card border-t border-gold-400/10 flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.2]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=1200')" }} />
        <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto px-4">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-gold-400">
            Immerse in the Golden Glow
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
            Our seating layouts are optimized for private affairs, birthday ceremonies, corporate dinners, or couples seeking dim-lit, luxurious booths.
          </p>
          <div className="pt-4">
            <Link
              href="/reserve"
              className="px-8 py-3.5 bg-gold-400 text-dark-base hover:bg-transparent hover:text-gold-400 border border-gold-400 text-xs font-bold uppercase tracking-widest transition-luxury inline-block"
            >
              Reserve an Ambience
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
