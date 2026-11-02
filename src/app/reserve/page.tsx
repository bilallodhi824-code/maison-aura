"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createReservation, createOrderInquiry } from "@/lib/firebase";
import { useApp } from "@/context/AppContext";
import { Calendar, Users, Clock, CheckCircle2, ShoppingBag } from "lucide-react";

function ReservationContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const packageParam = searchParams.get("package");
  const preorderParam = searchParams.get("preorder");

  const { cart, cartTotal, clearCart } = useApp();
  
  const [formData, setFormData] = useState(() => ({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "19:30",
    guestCount: 2,
    diningType: typeParam || "Regular Dining",
    notes: packageParam ? `Interested in buffet package: ${packageParam}. ` : "",
  }));

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Check if we are attaching a pre-order
      const hasPreorder = preorderParam === "true" && cart.length > 0;
      
      const reservationPayload = {
        ...formData,
        preorderItems: hasPreorder ? cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })) : null,
        preorderTotal: hasPreorder ? cartTotal : null,
      };

      const res = await createReservation(reservationPayload);
      setBookingId(res.id);

      // If preordered, also create an order inquiry
      if (hasPreorder) {
        await createOrderInquiry({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          type: "Takeaway/Preorder",
          items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
          total: cartTotal,
          reservationId: res.id,
        });
        clearCart();
      }

      setSuccess(true);
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
      {success ? (
        <div className="glass-panel border border-gold-400/30 p-8 sm:p-16 rounded-sm text-center space-y-6 max-w-2xl mx-auto gold-border-glow">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-gold-400 animate-bounce" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-gold-400 uppercase tracking-wider">
            Sojourn Secured
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed font-light">
            Thank you, <span className="font-semibold text-gold-400">{formData.name}</span>. Your reservation request has been transmitted. Our Maître D&apos; is reviewing slot occupancy and will transmit a confirmation code via email or phone shortly.
          </p>
          <div className="bg-dark-base p-4 border border-gold-400/10 rounded inline-block text-left space-y-1">
            <p className="text-xs text-gray-500">Booking Reference:</p>
            <p className="font-serif text-sm font-bold text-gold-400 tracking-widest uppercase">{bookingId}</p>
          </div>
          <div className="pt-6">
            <Link
              href="/"
              className="px-8 py-3.5 bg-gold-400 text-dark-base hover:bg-transparent hover:text-gold-400 border border-gold-400 text-xs font-bold uppercase tracking-widest transition-luxury inline-block"
            >
              Return to Zenith
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Form Column */}
          <div className="lg:col-span-2 glass-panel border border-gold-400/15 p-8 rounded-sm space-y-6">
            <h2 className="font-serif text-2xl font-bold text-gold-400 tracking-wide uppercase border-b border-gold-400/10 pb-4">
              Reservation Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Ambassador Name</label>
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
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ambassador@domain.com"
                    className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Ambassador Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Dining Type</label>
                  <select
                    value={formData.diningType}
                    onChange={(e) => setFormData({ ...formData, diningType: e.target.value })}
                    className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                  >
                    <option value="Regular Dining">Regular Fine Dining</option>
                    <option value="Buffet Experience">Gourmet Buffet Experience</option>
                    <option value="Private Event">Private Hall Event</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Preferred Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Guests Count</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 2 })}
                    className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Special Requests &amp; Allergen Declarations</label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="E.g., Gluten allergies, window side booth, celebrating birthday, pre-order coordination notes..."
                  className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gold-400 text-dark-base font-bold uppercase tracking-widest text-xs border border-gold-400 hover:bg-transparent hover:text-gold-400 transition-luxury cursor-pointer disabled:opacity-50"
              >
                {loading ? "Transmitting Reservation Details..." : "Confirm Reservation Slot"}
              </button>
            </form>
          </div>

          {/* Details Sidebar */}
          <div className="space-y-6">
            {preorderParam === "true" && cart.length > 0 && (
              <div className="glass-panel border border-gold-400/10 p-6 rounded-sm space-y-4">
                <h3 className="font-serif text-sm font-semibold text-gold-400 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Attached Pre-Order
                </h3>
                <div className="space-y-2 border-b border-gold-400/10 pb-4 max-h-[220px] overflow-y-auto">
                  {cart.map((i) => (
                    <div key={i.id} className="flex justify-between items-center text-xs text-gray-400">
                      <span>{i.name} (x{i.qty})</span>
                      <span className="font-serif font-medium text-gold-400">${i.price * i.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-gray-400">Preorder Valuation:</span>
                  <span className="font-serif text-gold-400">${cartTotal}</span>
                </div>
              </div>
            )}

            <div className="glass-panel border border-gold-400/10 p-6 rounded-sm space-y-6">
              <h3 className="font-serif text-sm font-semibold text-gold-400 uppercase tracking-wider">
                Booking Protocol
              </h3>
              <div className="space-y-4 text-xs text-gray-400 leading-relaxed font-light">
                <div className="flex gap-3">
                  <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                  <p>Check-in details must be validated at least 15 minutes before the reservation slot.</p>
                </div>
                <div className="flex gap-3">
                  <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                  <p>Table reservations are preserved for a maximum grace period of 20 minutes.</p>
                </div>
                <div className="flex gap-3">
                  <Users className="w-4 h-4 text-gold-400 shrink-0" />
                  <p>For large party bookings exceeding 12 delegates, please contact our administrative desk directly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReservationPage() {
  return (
    <div className="min-h-screen bg-dark-base flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="relative py-20 flex items-center justify-center bg-dark-card border-b border-gold-400/10">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1200')" }} />
        <div className="relative z-10 text-center space-y-3 max-w-3xl mx-auto px-4">
          <span className="text-gold-400 text-xs uppercase tracking-[0.4em] block font-semibold">Table &amp; Salon Booking</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide">Secure A Culinary Sojourn</h1>
          <div className="w-12 h-[1px] bg-gold-400 mx-auto mt-3" />
        </div>
      </section>

      <Suspense fallback={
        <div className="flex-1 py-24 text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-sm text-gold-400 tracking-wider">Unveiling Booking Options...</p>
        </div>
      }>
        <ReservationContent />
      </Suspense>

      <Footer />
    </div>
  );
}
