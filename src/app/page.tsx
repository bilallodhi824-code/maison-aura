"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMenuItems, getBuffetPackages } from "@/lib/firebase";
import { useApp } from "@/context/AppContext";
import { ChevronRight, Award, ArrowRight, Quote, Check } from "lucide-react";
import { MenuItem, BuffetPackage } from "@/types";

export default function HomePage() {
  const { addToCart } = useApp();
  const [specials, setSpecials] = useState<MenuItem[]>([]);
  const [buffets, setBuffets] = useState<BuffetPackage[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = (dish: MenuItem) => {
    addToCart(dish);
    setAddedId(dish.id);
    setTimeout(() => {
      setAddedId((curr) => (curr === dish.id ? null : curr));
    }, 1500);
  };

  useEffect(() => {
    async function loadData() {
      const items = await getMenuItems();
      // Filter chef specials
      setSpecials(items.filter(item => item.tags?.includes("chef special")).slice(0, 4));
      
      const buffetList = await getBuffetPackages();
      setBuffets(buffetList.slice(0, 2));
    }
    loadData();
  }, []);

  const testimonials = [
    {
      name: "Lord Sterling Sterling",
      title: "Gastronomic Critic",
      quote: "Maison Aura does not just serve food; they choreograph a symphony of culinary luxury. The Wagyu Ribeye is a masterpiece that melts into pure flavor.",
      stars: 5,
    },
    {
      name: "Samantha Dubois",
      title: "Vogue Lifestyle Editor",
      quote: "The ambiance transports you to a premium lounge in Paris. The combination of delicate ramen broth and lavish seafood platters is ingenious.",
      stars: 5,
    },
    {
      name: "Chef Raymond Blanc",
      title: "Culinary Consultant",
      quote: "An exceptional level of detail. The texture of their house-pulled noodles and the precise aging of their steaks meets the highest international standards.",
      stars: 5,
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-dark-base flex flex-col">
      <Navbar />

      {/* 1. LUXURY HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden border-b border-gold-400/10">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/60 to-transparent" />
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
          <div className="flex justify-center items-center gap-2 text-gold-400 text-xs tracking-[0.4em] uppercase">
            <Award className="w-4 h-4 gold-glow" />
            <span>A Three-Star Culinary Sanctuary</span>
            <Award className="w-4 h-4 gold-glow" />
          </div>
          
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
            Where Taste Meets <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 gold-glow">
              Pure Opulence
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 tracking-wide font-light leading-relaxed">
            Welcome to Maison Aura. An exquisite culinary theatre showcasing seared dry-aged steaks, authentic ramen recipes, and grand shared seafood platters.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              href="/reserve"
              className="w-full sm:w-auto px-8 py-3.5 bg-gold-400 text-dark-base hover:bg-transparent hover:text-gold-400 border border-gold-400 text-xs font-bold uppercase tracking-widest transition-luxury"
            >
              Secure Table
            </Link>
            <Link
              href="/menu"
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-white/5 text-[#FAF9F6] border border-white/20 text-xs font-bold uppercase tracking-widest transition-luxury"
            >
              Explore Menu
            </Link>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50 animate-bounce">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400">Scroll Down</span>
          <div className="w-[1px] h-6 bg-gold-400" />
        </div>
      </section>

      {/* 2. SIGNATURE BRAND INTRO */}
      <section className="py-24 bg-dark-base border-b border-gold-400/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual Column */}
            <div className="relative">
              <div className="relative aspect-[4/5] border border-gold-400/20 p-3 bg-dark-card rounded-sm overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop" 
                  alt="Executive Chef" 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover filter grayscale contrast-125 hover:grayscale-0 transition-luxury p-3"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gold-400 text-dark-base p-6 rounded shadow-xl hidden sm:block">
                <p className="font-serif text-2xl font-bold">25+</p>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-dark-base/80 mt-1">Years of Michelin Mastery</p>
              </div>
            </div>

            {/* Content Column */}
            <div className="space-y-8">
              <span className="text-gold-400 text-xs uppercase tracking-[0.3em] block">Our Noble Concept</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide leading-tight">
                Crafting Culinary Poetry <br />For The Connoisseur
              </h2>
              <div className="w-12 h-[1px] bg-gold-400" />
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                At Maison Aura, our kitchen is a sanctuary where age-old culinary legacies converge. We source our USDA Wagyu beef from sustainable heritage ranches, simmer our broth base for 24 continuous hours, and select ocean harvests daily.
              </p>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                Led by world-renowned Master Chef Claude Valois, our team dedicates every plate to presenting luxury, symmetry, and intense flavour harmony.
              </p>
              <div className="flex items-center gap-6 pt-4">
                <div>
                  <h4 className="font-serif text-gold-400 font-bold text-lg">Claude Valois</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Maître de Cuisine</p>
                </div>
                <div className="h-10 w-[1px] bg-gold-400/20" />
                <Link
                  href="/about"
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#FAF9F6] hover:text-gold-400 transition-luxury"
                >
                  <span>Our Story</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED GOURMET CATEGORIES */}
      <section className="py-24 bg-dark-card border-b border-gold-400/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
          <div className="space-y-4">
            <span className="text-gold-400 text-xs uppercase tracking-[0.3em] block">Explore the Universe</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold">Gastronomy Domains</h2>
            <div className="w-12 h-[1px] bg-gold-400 mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Prime Steaks", img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop", link: "/menu?cat=Steaks" },
              { name: "Artisanal Ramen", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=400&auto=format&fit=crop", link: "/menu?cat=Ramen" },
              { name: "Luxury Platters", img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=400&auto=format&fit=crop", link: "/platters" },
              { name: "Grand Buffets", img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=400&auto=format&fit=crop", link: "/buffet" },
            ].map((cat, idx) => (
              <Link 
                href={cat.link}
                key={idx} 
                className="group relative aspect-[3/4] overflow-hidden border border-gold-400/10 rounded-sm hover:border-gold-400 transition-luxury cursor-pointer"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${cat.img}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/40 to-transparent group-hover:via-dark-base/60 transition-luxury" />
                <div className="absolute bottom-6 left-0 right-0 text-center px-4 space-y-2">
                  <h3 className="font-serif text-lg sm:text-xl text-[#FAF9F6] group-hover:text-gold-400 transition-luxury">
                    {cat.name}
                  </h3>
                  <span className="text-[9px] uppercase tracking-widest text-gold-500 opacity-0 group-hover:opacity-100 transition-luxury flex items-center justify-center gap-1">
                    Enter Domain <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CHEF SPECIALS SPOTLIGHT */}
      <section className="py-24 bg-dark-base border-b border-gold-400/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <span className="text-gold-400 text-xs uppercase tracking-[0.3em] block font-semibold">Today&apos;s Masterpieces</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold">Chef&apos;s Recommended Spotlights</h2>
              <div className="w-12 h-[1px] bg-gold-400" />
            </div>
            <Link 
              href="/menu" 
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-luxury font-bold"
            >
              <span>View Full Gastronomy Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specials.map((dish) => (
              <div 
                key={dish.id} 
                className="group bg-dark-card border border-gold-400/10 rounded-sm overflow-hidden flex flex-col justify-between hover:border-gold-400/30 transition-luxury hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image 
                    src={dish.image} 
                    alt={dish.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-luxury duration-700"
                  />
                  <span className="absolute top-3 left-3 bg-gold-400 text-dark-base text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 z-10">
                    Chef Special
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-serif text-base font-semibold text-gold-400 tracking-wide leading-tight group-hover:text-gold-300">
                        {dish.name}
                      </h3>
                      <span className="font-serif text-base font-semibold text-gold-400 shrink-0">${dish.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {dish.shortDescription}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddToCart(dish)}
                    className={`w-full py-2.5 border text-[10px] font-bold uppercase tracking-widest transition-luxury cursor-pointer flex items-center justify-center gap-1.5 ${
                      addedId === dish.id
                        ? "bg-gold-400 border-gold-400 text-dark-base font-extrabold"
                        : "bg-transparent hover:bg-gold-400 border-gold-400/30 hover:border-gold-400 text-gold-400 hover:text-dark-base"
                    }`}
                  >
                    {addedId === dish.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added to Selection ✓
                      </>
                    ) : (
                      "Add to Selection"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LUXURY BUFFET HIGHLIGHT */}
      <section className="py-24 bg-dark-card border-b border-gold-400/5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gold-400/2 opacity-[0.03] blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content Column */}
            <div className="space-y-8 order-2 lg:order-1">
              <span className="text-gold-400 text-xs uppercase tracking-[0.3em] block">Grand Buffet Rituals</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
                The Royal Feast &amp; <br />Interactive Live Kitchen
              </h2>
              <div className="w-12 h-[1px] bg-gold-400" />
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                Indulge in a breathtaking culinary journey featuring over 25+ handpicked international delicacies. From live sushi rolling and tempura fryers to fine-cut roasted carvings and a grand dessert station.
              </p>

              <div className="space-y-4">
                {buffets.map((pack) => (
                  <div key={pack.id} className="p-5 border border-gold-400/10 hover:border-gold-400/20 bg-dark-base rounded flex items-center justify-between gap-4 transition-luxury">
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-gold-400">{pack.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{pack.timings}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-serif text-gold-400 font-bold">${pack.price}</span>
                      <span className="text-[10px] text-gray-500 block">per ambassador</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6 pt-4">
                <Link
                  href="/buffet"
                  className="px-8 py-3.5 bg-gold-400 text-dark-base hover:bg-transparent hover:text-gold-400 border border-gold-400 text-xs font-bold uppercase tracking-widest transition-luxury"
                >
                  Explore Buffets
                </Link>
                <Link
                  href="/reserve?type=Buffet%20Experience"
                  className="text-xs uppercase tracking-widest text-[#FAF9F6] hover:text-gold-400 transition-luxury font-bold"
                >
                  Book Buffet Seat
                </Link>
              </div>
            </div>

            {/* Visual Column */}
            <div className="relative order-1 lg:order-2">
              <div className="relative aspect-video sm:aspect-[4/3] border border-gold-400/20 p-3 bg-dark-base rounded-sm overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=800&auto=format&fit=crop" 
                  alt="Buffet feast" 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover filter contrast-110 brightness-90 hover:scale-105 transition-luxury duration-700 p-3"
                />
              </div>
              <div className="absolute -top-4 -left-4 bg-dark-base border border-gold-400/20 px-5 py-3 text-center rounded hidden sm:block">
                <p className="text-[10px] uppercase tracking-widest text-gold-400">Live Seafood</p>
                <p className="font-serif text-xs font-semibold text-[#FAF9F6] mt-0.5">Every Weekend</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINE DINING EXPERIENCE & AMBIANCE */}
      <section className="py-24 bg-dark-base border-b border-gold-400/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual Column */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] border border-gold-400/10 rounded-sm overflow-hidden hover:border-gold-400/30 transition-luxury">
                <Image 
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop" 
                  alt="Ambiance 1" 
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] border border-gold-400/10 rounded-sm overflow-hidden hover:border-gold-400/30 transition-luxury mt-8">
                <Image 
                  src="https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=400&auto=format&fit=crop" 
                  alt="Ambiance 2" 
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Content Column */}
            <div className="space-y-8">
              <span className="text-gold-400 text-xs uppercase tracking-[0.3em] block">Symphony of Lights &amp; Velvet</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide leading-tight">
                A Visual Theatre of Luxury &amp; Decorum
              </h2>
              <div className="w-12 h-[1px] bg-gold-400" />
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                Designed by award-winning architectural firm Studio Bordeaux, our dining chambers boast customized warm velvet booths, soft amber chandeliers, and vintage walnut wood columns.
              </p>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                Whether celebrating a confidential business transaction in our private mezzanine or dining as a family around our gourmet tables, our layout promises absolute privacy and premium acoustics.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-1">
                  <h4 className="font-serif text-gold-400 font-medium text-sm">Private Lounge</h4>
                  <p className="text-xs text-gray-500">Accommodates up to 14 ambassadors</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-gold-400 font-medium text-sm">Grand Salon</h4>
                  <p className="text-xs text-gray-500">Perfect for up to 120 guests</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="py-24 bg-dark-card border-b border-gold-400/5 relative">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-10">
          <Quote className="w-12 h-12 text-gold-400/20 mx-auto" />

          <div className="min-h-[140px] flex items-center justify-center">
            <p className="font-serif text-lg sm:text-2xl italic text-gray-200 leading-relaxed">
              &quot;{testimonials[activeTestimonial].quote}&quot;
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif text-gold-400 font-bold text-base">{testimonials[activeTestimonial].name}</h4>
            <p className="text-xs uppercase tracking-widest text-gray-500">{testimonials[activeTestimonial].title}</p>
          </div>

          {/* Bullet Controls */}
          <div className="flex justify-center space-x-3">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-luxury cursor-pointer ${
                  activeTestimonial === idx ? "bg-gold-400 scale-125" : "bg-gold-400/20 hover:bg-gold-400/50"
                }`}
                aria-label={`Testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. GALLERY PREVIEW & RESERVATION CTA */}
      <section className="py-24 bg-dark-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
          <div className="space-y-4">
            <span className="text-gold-400 text-xs uppercase tracking-[0.3em] block">Preserving Memories</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold">Moments of Splendor</h2>
            <div className="w-12 h-[1px] bg-gold-400 mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="relative aspect-square border border-gold-400/10 rounded-sm overflow-hidden filter brightness-90 hover:brightness-100 transition-luxury">
              <Image src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop" fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" alt="Gourmet dish" />
            </div>
            <div className="relative aspect-square border border-gold-400/10 rounded-sm overflow-hidden filter brightness-90 hover:brightness-100 transition-luxury">
              <Image src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=400&auto=format&fit=crop" fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" alt="Ramen" />
            </div>
            <div className="relative aspect-square border border-gold-400/10 rounded-sm overflow-hidden filter brightness-90 hover:brightness-100 transition-luxury">
              <Image src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=400&auto=format&fit=crop" fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" alt="Buffet setting" />
            </div>
            <div className="relative aspect-square border border-gold-400/10 rounded-sm overflow-hidden filter brightness-90 hover:brightness-100 transition-luxury">
              <Image src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=400&auto=format&fit=crop" fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" alt="Desert plating" />
            </div>
          </div>

          {/* High-End Booking Banner CTA */}
          <div className="glass-panel border border-gold-400/25 p-8 sm:p-16 max-w-5xl mx-auto rounded-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800')" }} />
            <div className="relative z-10 space-y-6">
              <h3 className="font-serif text-3xl sm:text-4xl text-gold-400 font-bold uppercase tracking-wide">
                Indulge in a Gastronomic Ritual
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
                Reservations are highly recommended. Walk-ins are accommodated based on luxury chamber availability. Secure your table or private salon online.
              </p>
              <div className="pt-4">
                <Link
                  href="/reserve"
                  className="px-8 py-3.5 bg-gold-400 text-dark-base hover:bg-transparent hover:text-gold-400 border border-gold-400 text-xs font-bold uppercase tracking-widest transition-luxury inline-block"
                >
                  Initiate Booking
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
