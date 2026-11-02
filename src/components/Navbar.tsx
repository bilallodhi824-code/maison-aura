"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, Menu, X, Trash2, Calendar } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, removeFromCart, updateQty, cartTotal, cartCount } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Menu", href: "/menu" },
    { name: "Buffet", href: "/buffet" },
    { name: "Platters", href: "/platters" },
    { name: "Gallery", href: "/gallery" },
    { name: "Offers", href: "/offers" },
    { name: "Events", href: "/private-events" },
    { name: "Contact", href: "/contact" },
  ];

  const handleCheckout = () => {
    // Navigate to Reservation/Checkout with order notes
    setCartOpen(false);
    router.push(`/reserve?preorder=true`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-gold-400/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex flex-col items-center group">
                <span className="font-serif text-2xl font-bold tracking-widest text-gold-400 group-hover:text-gold-300 transition-luxury gold-glow">
                  MAISON AURA
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-gold-500/80 -mt-1">
                  haute gastronomie
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-3 xl:space-x-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-[10px] xl:text-xs tracking-widest uppercase transition-luxury hover:text-gold-400 ${
                      isActive ? "text-gold-400 border-b border-gold-400/60 pb-0.5 font-semibold" : "text-gray-300"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* Cart Toggle */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 rounded-full border border-gold-400/30 hover:border-gold-400 bg-dark-card text-gold-400 hover:text-gold-300 transition-luxury cursor-pointer"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-400 text-dark-base text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Book Table Button */}
              <Link
                href="/reserve"
                className="hidden md:flex items-center space-x-2 px-6 py-2.5 border border-gold-400 bg-gold-400 hover:bg-transparent text-dark-base hover:text-gold-400 text-xs font-bold uppercase tracking-widest transition-luxury cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book A Table</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-300 hover:text-gold-400 transition-luxury cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gold-400/10 bg-dark-base/95 backdrop-blur-lg">
            <div className="px-2 pt-4 pb-6 space-y-2 sm:px-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-md text-base font-medium uppercase tracking-widest ${
                      isActive ? "bg-walnut/30 text-gold-400 font-semibold" : "text-gray-300 hover:bg-dark-card hover:text-gold-400"
                    } transition-luxury`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 px-4">
                <Link
                  href="/reserve"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 py-3 border border-gold-400 bg-gold-400 text-dark-base text-xs font-bold uppercase tracking-widest transition-luxury"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book A Table</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-dark-card border-l border-gold-400/20 text-[#FAF9F6] flex flex-col shadow-2xl">
              {/* Header */}
              <div className="p-6 border-b border-gold-400/10 flex items-center justify-between">
                <h2 className="font-serif text-xl text-gold-400 tracking-wider flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gold-400" />
                  Your Culinary Selection
                </h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1 rounded-full border border-gold-400/20 text-gray-400 hover:text-gold-400 transition-luxury cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <ShoppingBag className="w-16 h-16 text-gold-400/20 mb-4" />
                    <p className="font-serif text-lg text-gray-400">Your selection is currently empty</p>
                    <p className="text-sm text-gray-500 mt-2 max-w-xs">
                      Explore our gourmet menu and add items to pre-order or reserve with your table.
                    </p>
                    <Link
                      href="/menu"
                      onClick={() => setCartOpen(false)}
                      className="mt-6 px-6 py-2.5 border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-dark-base text-xs font-bold uppercase tracking-widest transition-luxury"
                    >
                      Browse Menu
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 pb-6 border-b border-gold-400/10">
                      {item.image && (
                        <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded border border-gold-400/20">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-serif text-sm font-medium text-gold-400 tracking-wide">{item.name}</h4>
                        <p className="text-xs text-gray-400">{item.category}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="text-xs w-6 h-6 border border-gold-400/20 rounded flex items-center justify-center hover:border-gold-400 transition-luxury"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="text-xs w-6 h-6 border border-gold-400/20 rounded flex items-center justify-center hover:border-gold-400 transition-luxury"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gold-300 font-serif">${item.price * item.qty}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="block text-gray-500 hover:text-red-400 mt-2 ml-auto cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-gold-400/15 bg-dark-base">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm tracking-wider uppercase text-gray-400">Total Valuation</span>
                    <span className="text-xl font-serif text-gold-400 font-bold">${cartTotal}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-6 text-center leading-relaxed">
                    Note: Pre-ordering allows us to prepare your ingredients. Final payment is completed at the restaurant.
                  </p>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-gold-400 text-dark-base font-bold uppercase tracking-widest text-xs border border-gold-400 hover:bg-transparent hover:text-gold-400 transition-luxury cursor-pointer"
                  >
                    Reserve with Table Inquiry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
