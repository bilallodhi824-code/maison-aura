"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getOffers } from "@/lib/firebase";
import { Sparkles, Copy, Check } from "lucide-react";
import { Offer } from "@/types";

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function loadOffers() {
      setLoading(true);
      try {
        const o = await getOffers();
        setOffers(o.filter(item => item.active));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="min-h-screen bg-dark-base flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="relative py-20 flex items-center justify-center bg-dark-card border-b border-gold-400/10">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200')" }} />
        <div className="relative z-10 text-center space-y-3 max-w-3xl mx-auto px-4">
          <span className="text-gold-400 text-xs uppercase tracking-[0.4em] block font-semibold">Gourmet Affiliation</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide">VIP Offers &amp; Special Selections</h1>
          <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-3" />
        </div>
      </section>

      {loading ? (
        <div className="flex-1 py-24 text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-sm text-gold-400 tracking-wider">Unlocking Special Cabinets...</p>
        </div>
      ) : (
        <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers.map((offer) => {
              const isCopied = copiedCode === offer.code;
              return (
                <div
                  key={offer.id}
                  className="glass-panel border border-gold-400/15 p-8 rounded-sm flex flex-col justify-between hover:border-gold-400 transition-luxury space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-gold-400/10 text-gold-400 border border-gold-400/20 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                        {offer.tag || "Special Promotion"}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-gold-400 tracking-wide">{offer.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">{offer.description}</p>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-gold-400/10">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-gray-500 block">Invitation Code:</span>
                      <button
                        onClick={() => handleCopy(offer.code)}
                        className="font-mono text-xs font-semibold text-[#FAF9F6] bg-dark-base border border-gold-400/15 hover:border-gold-400/50 px-2.5 py-1 tracking-widest flex items-center gap-1.5 transition-luxury cursor-pointer"
                        title="Click to copy code"
                      >
                        <span>{offer.code || "NOCODE"}</span>
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gold-400" />}
                      </button>
                    </div>
                    <Link
                      href="/reserve"
                      className="px-6 py-2.5 bg-gold-400 text-dark-base hover:bg-transparent hover:text-gold-400 border border-gold-400 text-[10px] font-bold uppercase tracking-widest transition-luxury cursor-pointer"
                    >
                      Claim Slot
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Loyalty Section */}
          <div className="bg-dark-card border border-gold-400/10 p-8 sm:p-12 rounded-sm text-center space-y-6 max-w-3xl mx-auto mt-16">
            <div className="flex justify-center"><Sparkles className="w-10 h-10 text-gold-400/30" /></div>
            <h3 className="font-serif text-xl font-bold text-gold-400 uppercase tracking-widest">Maison Aura Gold Alliance</h3>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xl mx-auto">
              Ambassadors with more than 5 validated bookings per semester are automatically promoted to our Gold tier, unlocking priority seating, complimentary chef appetizers, and access to vintage champagne vaults.
            </p>
            <div className="pt-2">
              <Link
                href="/contact?subject=Gold%20Alliance%20Inquiry"
                className="px-6 py-2 border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-dark-base text-[10px] font-bold uppercase tracking-widest transition-luxury inline-block"
              >
                Inquire Tier Status
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
