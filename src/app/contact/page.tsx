"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { submitContactMessage } from "@/lib/firebase";
import { Mail, Phone, MapPin, CheckCircle2, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContactMessage(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
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
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200')" }} />
        <div className="relative z-10 text-center space-y-3 max-w-3xl mx-auto px-4">
          <span className="text-gold-400 text-xs uppercase tracking-[0.4em] block font-semibold">Chamber Inquiry</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide">Connect With The Embassy</h1>
          <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-3" />
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Info Details & Map */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-gold-400 uppercase tracking-wide">The Pavilion Coordinates</h2>
              <div className="w-12 h-[1px] bg-gold-400" />
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                For administrative requests, VIP catering, private dining reservations, or feedback, please write to us.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 bg-dark-card border border-gold-400/5 rounded">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#FAF9F6] uppercase tracking-wider">Address</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    1088 Champs-Élysées Boulevard, Suite A, Luxury Quarter, NY 10019
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-dark-card border border-gold-400/5 rounded">
                <Phone className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#FAF9F6] uppercase tracking-wider">Phone Lines</h4>
                  <p className="text-xs text-gray-400 mt-1">Ambassador desk: +1 (212) 555-8888</p>
                  <p className="text-[10px] text-gold-500 italic mt-0.5">WhatsApp concierge enabled</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-dark-card border border-gold-400/5 rounded">
                <Mail className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#FAF9F6] uppercase tracking-wider">Email Letters</h4>
                  <p className="text-xs text-gray-400 mt-1">ambassador@maisonaura.com</p>
                </div>
              </div>
            </div>

            {/* Google Map Embed Placeholder */}
            <div className="relative aspect-video bg-dark-card border border-gold-400/10 rounded-sm overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-cover bg-center opacity-[0.2]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=800')" }} />
              <div className="relative z-10 text-center space-y-2 px-4">
                <MapPin className="w-8 h-8 text-gold-400 mx-auto" />
                <p className="font-serif text-sm text-gold-400 font-bold uppercase tracking-wider">Maison Aura Location Map</p>
                <p className="text-[10px] text-gray-500">Champs-Élysées Boulevard Intersection</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="glass-panel border border-gold-400/15 p-8 rounded-sm space-y-6">
            <h2 className="font-serif text-2xl font-bold text-gold-400 tracking-wide uppercase border-b border-gold-400/10 pb-4">
              Write An Inquiry
            </h2>

            {success ? (
              <div className="p-6 bg-gold-400/10 border border-gold-400/25 rounded text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-gold-400 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-gold-400 uppercase tracking-widest">Letter Received</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Your message has been logged in our secure server. An ambassador will reach back to your email coordinates within 12 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2 border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-dark-base text-[10px] font-bold uppercase tracking-widest transition-luxury cursor-pointer"
                >
                  Write Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Your Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ambassador@domain.com"
                    className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="E.g., Catering inquiry, feedback..."
                    className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write details of your request here..."
                    className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gold-400 text-dark-base font-bold uppercase tracking-widest text-xs border border-gold-400 hover:bg-transparent hover:text-gold-400 transition-luxury cursor-pointer"
                >
                  {loading ? "Transmitting..." : "Send Message"}
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
