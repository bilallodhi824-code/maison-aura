"use client";

import React, { useState } from "react";
import Link from "next/link";
import { submitContactMessage } from "@/lib/firebase";
import { Phone, Mail, MapPin, Award, ArrowUp } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await submitContactMessage({
        name: "VIP Club Subscriber",
        email: email,
        subject: "VIP Newsletter Subscription",
        message: "Customer subscribed to the VIP Dining Club newsletter.",
      });
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-dark-base border-t border-gold-400/10 text-gray-400 font-sans mt-auto">
      {/* Top Banner: Signature Brand Value */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-gold-400/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-gold-400 shrink-0" />
            <div>
              <h4 className="font-serif text-gold-400 font-bold uppercase tracking-wider text-sm">Three Michelin Star Philosophy</h4>
              <p className="text-xs text-gray-500 mt-1">Exquisite ingredients, pristine service, master craftsmanship.</p>
            </div>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 border border-gold-400/20 rounded hover:border-gold-400 text-xs text-gold-400 uppercase tracking-widest transition-luxury cursor-pointer"
          >
            <span>Return to Zenith</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Presentation */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-widest text-gold-400 gold-glow">
                MAISON AURA
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold-500/80 mt-1">
                haute gastronomie
              </span>
            </div>
            <p className="text-xs leading-relaxed text-gray-500">
              An elegant fusion of modern steak craft, authentic Japanese ramen legacy, and grand ocean platter celebrations. Elevating dining into a luxury visual experience.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="p-2 border border-gold-400/10 hover:border-gold-400 rounded-full text-gold-400 transition-luxury">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="p-2 border border-gold-400/10 hover:border-gold-400 rounded-full text-gold-400 transition-luxury">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Dining Schedule */}
          <div className="space-y-6">
            <h4 className="font-serif text-gold-400 font-bold uppercase tracking-wider text-sm border-b border-gold-400/15 pb-2">
              Hours of Sojourn
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start justify-between">
                <span className="text-gray-500">Lunch Service:</span>
                <span className="text-right text-[#FAF9F6] font-serif">12:00 PM - 3:30 PM</span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-gray-500">Dinner Service:</span>
                <span className="text-right text-[#FAF9F6] font-serif">6:30 PM - 11:00 PM</span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-gray-500">Weekend Buffet:</span>
                <span className="text-right text-gold-400 font-serif">12:00 PM - 10:30 PM</span>
              </li>
              <li className="text-[10px] text-gold-500 italic mt-2">
                * Kitchen closes 45 minutes prior to closing.
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h4 className="font-serif text-gold-400 font-bold uppercase tracking-wider text-sm border-b border-gold-400/15 pb-2">
              The Pavilion
            </h4>
            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="leading-relaxed">1088 Champs-Élysées Boulevard, Suite A, Luxury Quarter, NY 10019</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+1 (212) 555-8888</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>ambassador@maisonaura.com</span>
              </li>
            </ul>
          </div>

          {/* VIP Club SignUp */}
          <div className="space-y-6">
            <h4 className="font-serif text-gold-400 font-bold uppercase tracking-wider text-sm border-b border-gold-400/15 pb-2">
              VIP Dining Alliance
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Subscribe to unlock private chef tables, gourmet seasonal releases, and priority reservation reservations.
            </p>
            {submitted ? (
              <div className="p-3 bg-gold-400/10 border border-gold-400/20 text-gold-400 text-xs rounded text-center">
                Welcome to the Inner Circle. Verification sent.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  placeholder="Your Ambassador Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-dark-card border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-2.5 text-xs text-[#FAF9F6] transition-luxury"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold-400 hover:bg-transparent text-dark-base hover:text-gold-400 border border-gold-400 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-luxury cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Acquire Invitation"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Legal */}
      <div className="bg-dark-base/50 py-6 border-t border-gold-400/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-wider text-gray-600">
          <p>© {new Date().getFullYear()} Maison Aura Hospitality Group. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-gold-400 transition-luxury">Terms of Decorum</a>
            <a href="#" className="hover:text-gold-400 transition-luxury">Privacy Protocol</a>
            <Link href="/admin" className="text-gold-500 hover:text-gold-400 font-bold transition-luxury">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
