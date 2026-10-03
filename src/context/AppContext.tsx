"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { subscribeToAuth, adminLogout } from "@/lib/firebase";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  category?: string;
}

interface AppContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  adminUser: any;
  loadingAuth: boolean;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Sync cart from LocalStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("aura_cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart data", e);
        }
      }
    }
  }, []);

  // Save cart to LocalStorage when changed
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("aura_cart", JSON.stringify(newCart));
    }
  };

  const addToCart = (item: Omit<CartItem, "qty">) => {
    const existingIndex = cart.findIndex((i) => i.id === item.id);
    if (existingIndex !== -1) {
      const updated = [...cart];
      updated[existingIndex].qty += 1;
      saveCart(updated);
    } else {
      saveCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    const filtered = cart.filter((i) => i.id !== id);
    saveCart(filtered);
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    const updated = cart.map((i) => (i.id === id ? { ...i, qty } : i));
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((count, item) => count + item.qty, 0);

  // Subscribe to Auth changes
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setAdminUser(user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await adminLogout();
    setAdminUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartTotal,
        cartCount,
        adminUser,
        loadingAuth,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
