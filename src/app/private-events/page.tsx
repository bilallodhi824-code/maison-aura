"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createReservation } from "@/lib/firebase";
import { CheckCircle2, Clock, Calendar, Users, Award } from "lucide-react";

export default function PrivateEventsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "19:00",
    guestCount: 20,
    diningType: "Private Event",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        notes: `PRIVATE EVENT INQUIRY: ${formData.notes}`
      };
      await createReservation(payload);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "19:00",
        guestCount: 20,
        diningType: "Private Event",
        notes: ""
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-base flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="relative py-20 flex items-center justify-center bg-dark-card border-b border-gold-400/10">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=1200')" }} />
        <div className="relative z-10 text-center space-y-3 max-w-3xl mx-auto px-4">
          <span className="text-gold-400 text-xs uppercase tracking-[0.4em] block font-semibold">Decorum &amp; Celebration</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide">Private Dining &amp; Corporate Galas</h1>
          <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-3" />
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Corporate Galas",
              desc: "From confidential board lunches to grand department celebrations. Equipped with premium acoustics and custom buffet options.",
              img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400"
            },
            {
              title: "Family Celebrations",
              desc: "Celebrate birthdays, weddings, or milestones inside our gold-lit velvet chambers. Custom chocolate plattings and signature mocktails available.",
              img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=400"
            },
            {
              title: "Private Chef Tables",
              desc: "An exclusive experience for up to 12 ambassadors inside Chef Claude Valois' private kitchen booth. Five courses designed live.",
              img: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=400"
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-dark-card border border-gold-400/10 rounded-sm overflow-hidden flex flex-col group hover:border-gold-400 transition-luxury">
              <div className="relative h-48 overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-luxury duration-700 filter brightness-95" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-serif text-lg font-semibold text-gold-400">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start pt-8">
          {/* Info Details */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-gold-400 uppercase tracking-wide">Event Protocol</h2>
            <div className="w-12 h-[1px] bg-gold-400" />
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              All private bookings must be coordinated at least 5 business days prior. We offer custom floral decorations, live piano accompaniment, and printing of personalized menus.
            </p>
            <div className="space-y-4 text-xs text-gray-400">
              <div className="flex gap-2.5">
                <Users className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Salons accommodate from 10 up to 140 guests.</span>
              </div>
              <div className="flex gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Catering menus can be fully custom built (dietary check).</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 glass-panel border border-gold-400/15 p-8 rounded-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-gold-400 uppercase tracking-wider border-b border-gold-400/10 pb-4">
              Submit Event Protocol Inquiry
            </h3>

            {success ? (
              <div className="p-8 bg-gold-400/10 border border-gold-400/25 rounded text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-gold-400 mx-auto animate-bounce" />
                <h4 className="font-serif text-lg font-bold text-gold-400 uppercase tracking-widest">Protocol Registered</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Your event inquiry has been logged. Our Guest Relations Manager will reach back to your details to coordinate layouts, menus, and logistics within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-dark-base text-[10px] font-bold uppercase tracking-widest transition-luxury cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Organizer Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="E.g., Corporate Planner Name"
                      className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Business Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="planner@company.com"
                      className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Guests</label>
                      <input
                        type="number"
                        min="10"
                        max="500"
                        required
                        value={formData.guestCount}
                        onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 20 })}
                        className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Date</label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Event Scope &amp; Culinary Inclusions</label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us about the event type, desired menu choices, decorations, bar requirements..."
                    className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gold-400 text-dark-base font-bold uppercase tracking-widest text-xs border border-gold-400 hover:bg-transparent hover:text-gold-400 transition-luxury cursor-pointer"
                >
                  {loading ? "Registering Event Inquiry..." : "Submit Event Coordinator Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
