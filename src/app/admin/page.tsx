"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { adminLogin, getReservations, getMenuItems, getContactMessages, getOrderInquiries, addMenuItem, updateMenuItem, deleteMenuItem, updateReservationStatus, getBuffetPackages, updateBuffetPackage, getOffers, updateOffer, deleteOffer, updateOrderStatus } from "@/lib/firebase";
import { Lock, LogOut, BarChart3, Calendar, ListFilter, Plus, Trash2, Edit2, ShieldAlert, Sparkles, Check, X, FileText, ShoppingBag, Layers } from "lucide-react";

export default function AdminPage() {
  const { adminUser, loadingAuth, logout } = useApp();
  const [activeTab, setActiveTab] = useState("overview");

  // Auth form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Operational states
  const [reservations, setReservations] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [buffets, setBuffets] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loadingOps, setLoadingOps] = useState(false);

  // Menu Modal form state
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [menuForm, setMenuForm] = useState({
    id: "",
    name: "",
    category: "Starters",
    shortDescription: "",
    longDescription: "",
    price: 10,
    image: "",
    chefSpecial: false,
    spicy: false,
    buffetAvailabilityFlag: false,
    platterAvailabilityFlag: false,
  });

  // Load operational data when user is authenticated
  useEffect(() => {
    if (adminUser) {
      loadDashboardData();
    }
  }, [adminUser]);

  async function loadDashboardData() {
    setLoadingOps(true);
    try {
      const [resList, menuList, msgList, ordList, buffList, offerList] = await Promise.all([
        getReservations(),
        getMenuItems(),
        getContactMessages(),
        getOrderInquiries(),
        getBuffetPackages(),
        getOffers()
      ]);
      
      setReservations(resList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setMenuItems(menuList);
      setMessages(msgList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setOrders(ordList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setBuffets(buffList);
      setOffers(offerList);
    } catch (e) {
      console.error("Dashboard load failure", e);
    } finally {
      setLoadingOps(false);
    }
  }

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await adminLogin(email, password);
    } catch (err: any) {
      setLoginError(err.message || "Invalid credentials");
    } finally {
      setLoginLoading(false);
    }
  };

  // Manage Reservations
  const handleResStatus = async (id: string, status: "Confirmed" | "Cancelled") => {
    try {
      await updateReservationStatus(id, status);
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (e) {
      console.error(e);
    }
  };

  // Manage Orders
  const handleOrderStatus = async (id: string, status: string) => {
    try {
      await updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (e) {
      console.error(e);
    }
  };

  // Menu Form CRUD submit
  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...menuForm,
        tags: [
          menuForm.chefSpecial ? "chef special" : "",
          menuForm.spicy ? "spicy" : "",
          menuForm.buffetAvailabilityFlag ? "buffet" : "",
          menuForm.platterAvailabilityFlag ? "platter" : ""
        ].filter(Boolean),
        availabilityStatus: true,
      };

      if (editingItem) {
        await updateMenuItem(payload);
      } else {
        await addMenuItem({ ...payload, id: `menu-${Date.now()}` });
      }
      setIsMenuModalOpen(false);
      setEditingItem(null);
      loadDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  // Menu Delete
  const handleMenuDelete = async (id: string) => {
    if (confirm("Delete this gastronomy dish permanently?")) {
      try {
        await deleteMenuItem(id);
        loadDashboardData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Initialize menu form for Add/Edit
  const openMenuModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setMenuForm({
        id: item.id,
        name: item.name,
        category: item.category,
        shortDescription: item.shortDescription || "",
        longDescription: item.longDescription || "",
        price: item.price,
        image: item.image || "",
        chefSpecial: item.tags?.includes("chef special") || false,
        spicy: item.tags?.includes("spicy") || false,
        buffetAvailabilityFlag: item.buffetAvailabilityFlag || false,
        platterAvailabilityFlag: item.platterAvailabilityFlag || false,
      });
    } else {
      setEditingItem(null);
      setMenuForm({
        id: "",
        name: "",
        category: "Starters",
        shortDescription: "",
        longDescription: "",
        price: 15,
        image: "",
        chefSpecial: false,
        spicy: false,
        buffetAvailabilityFlag: false,
        platterAvailabilityFlag: false,
      });
    }
    setIsMenuModalOpen(true);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-dark-base flex flex-col justify-center items-center space-y-4">
        <div className="w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
        <p className="font-serif text-sm text-gold-400 tracking-widest">Opening Secure Mezzanine...</p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER LOGIN SCREEN (IF NOT AUTHENTICATED)
  // -------------------------------------------------------------
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-dark-base flex flex-col justify-center items-center px-4 relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.02]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80')" }} />
        
        <div className="w-full max-w-md bg-dark-card border border-gold-400/25 p-8 rounded-sm space-y-8 relative z-10 shadow-2xl gold-border-glow">
          <div className="text-center space-y-2">
            <span className="font-serif text-xl tracking-[0.2em] text-gold-400 block font-bold">MAISON AURA</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 block">Staff Portals Mezzanine</span>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Staff Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E.g., admin@maisonaura.com"
                className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Security Password Code</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-gold-400 text-dark-base font-bold uppercase tracking-widest text-xs border border-gold-400 hover:bg-transparent hover:text-gold-400 transition-luxury cursor-pointer"
            >
              {loginLoading ? "Authorizing Security Clearance..." : "Establish Access Connection"}
            </button>
          </form>

          <div className="text-center text-[10px] text-gray-600 leading-relaxed pt-2">
            <p>Demo staff credentials:</p>
            <p className="font-semibold text-gold-500/80">admin@maisonaura.com / aura123</p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER ADMIN DASHBOARD (IF AUTHENTICATED)
  // -------------------------------------------------------------
  const todayCount = reservations.filter(
    (r) => r.date === new Date().toISOString().split("T")[0]
  ).length;

  return (
    <div className="min-h-screen bg-dark-base text-[#FAF9F6] flex flex-col lg:flex-row">
      
      {/* Sidebar navigation */}
      <aside className="w-full lg:w-72 bg-dark-card border-b lg:border-b-0 lg:border-r border-gold-400/10 flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="flex flex-col border-b border-gold-400/10 pb-6">
            <span className="font-serif text-lg font-bold tracking-widest text-gold-400 gold-glow">
              MAISON AURA
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mt-1">
              Decorum Dashboard
            </span>
          </div>

          <nav className="flex flex-col space-y-1">
            {[
              { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
              { id: "reservations", label: "Reservations", icon: <Calendar className="w-4 h-4" /> },
              { id: "menu", label: "Gastronomy Menu", icon: <ListFilter className="w-4 h-4" /> },
              { id: "orders", label: "Pre-Orders & Inquiries", icon: <ShoppingBag className="w-4 h-4" /> },
              { id: "messages", label: "Customer Inbox", icon: <FileText className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded text-xs uppercase tracking-widest transition-luxury cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gold-400 text-dark-base font-bold"
                    : "text-gray-400 hover:bg-dark-base hover:text-gold-400"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-gold-400/10 flex items-center justify-between gap-4 mt-6">
          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold text-gold-400 uppercase tracking-wider">{adminUser.displayName || "Ambassador"}</p>
            <p className="text-[9px] text-gray-500">Security Clearance</p>
          </div>
          <button
            onClick={logout}
            className="p-2 border border-gold-400/20 hover:border-gold-400 rounded text-gray-400 hover:text-gold-400 transition-luxury cursor-pointer"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-400/10 pb-6">
          <div className="space-y-1">
            <h1 className="font-serif text-3xl font-bold tracking-wide text-gold-400 uppercase">
              {activeTab === "overview" && "Decorum Overview"}
              {activeTab === "reservations" && "Reservations Registry"}
              {activeTab === "menu" && "Gastronomy Management"}
              {activeTab === "orders" && "Pre-Order Requests"}
              {activeTab === "messages" && "Staff Inbox"}
            </h1>
            <p className="text-xs text-gray-500">System logged in: {adminUser.email}</p>
          </div>

          <button
            onClick={loadDashboardData}
            disabled={loadingOps}
            className="px-4 py-2 border border-gold-400/20 hover:border-gold-400 bg-dark-card text-gold-400 hover:text-dark-base hover:bg-gold-400 text-[10px] font-bold uppercase tracking-widest transition-luxury cursor-pointer"
          >
            {loadingOps ? "Refreshing Registers..." : "Sync Registers"}
          </button>
        </div>

        {loadingOps ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-sm text-gold-400 tracking-wider">Synchronizing Central Database...</p>
          </div>
        ) : (
          <>
            {/* -------------------------------------------------------------
                TAB: OVERVIEW
                ------------------------------------------------------------- */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Panel */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Total Reservations", val: reservations.length, icon: <Calendar className="w-5 h-5 text-gold-400" /> },
                    { label: "Today's Sojourns", val: todayCount, icon: <Sparkles className="w-5 h-5 text-gold-400" /> },
                    { label: "Menu Delicacies", val: menuItems.length, icon: <ListFilter className="w-5 h-5 text-gold-400" /> },
                    { label: "Pending Orders", val: orders.filter(o => o.status === "Pending").length, icon: <ShoppingBag className="w-5 h-5 text-gold-400" /> }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-dark-card border border-gold-400/10 p-6 rounded flex items-center justify-between gap-4">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 block">{stat.label}</span>
                        <span className="font-serif text-2xl font-bold text-gold-400">{stat.val}</span>
                      </div>
                      <div className="p-3 bg-dark-base border border-gold-400/5 rounded">{stat.icon}</div>
                    </div>
                  ))}
                </div>

                {/* Grid Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Bookings */}
                  <div className="bg-dark-card border border-gold-400/10 p-6 rounded-sm space-y-4">
                    <h3 className="font-serif text-sm font-semibold uppercase tracking-widest text-gold-400 border-b border-gold-400/5 pb-3">Recent Reservations</h3>
                    <div className="space-y-3">
                      {reservations.slice(0, 5).map((res) => (
                        <div key={res.id} className="flex justify-between items-center text-xs border-b border-gold-400/5 pb-3 last:border-0 last:pb-0">
                          <div>
                            <p className="font-serif font-medium text-[#FAF9F6]">{res.name}</p>
                            <p className="text-[10px] text-gray-500">{res.date} at {res.time} • {res.guestCount} Guests</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-sm text-[9px] uppercase tracking-widest font-semibold border ${
                            res.status === "Confirmed"
                              ? "bg-gold-400/10 border-gold-400/30 text-gold-400"
                              : res.status === "Cancelled"
                              ? "bg-red-950/40 border-red-500/20 text-red-400"
                              : "bg-gray-800 border-gray-700 text-gray-400"
                          }`}>
                            {res.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Popular Domains chart */}
                  <div className="bg-dark-card border border-gold-400/10 p-6 rounded-sm space-y-6">
                    <h3 className="font-serif text-sm font-semibold uppercase tracking-widest text-gold-400 border-b border-gold-400/5 pb-3">Operational Domains</h3>
                    <div className="space-y-4">
                      {[
                        { cat: "Starters / Appetizers", count: menuItems.filter(i => i.category === "Starters").length, pct: "30%" },
                        { cat: "Premium Steaks", count: menuItems.filter(i => i.category === "Steaks").length, pct: "60%" },
                        { cat: "Artisanal Ramen", count: menuItems.filter(i => i.category === "Ramen").length, pct: "50%" },
                        { cat: "Sharing Platters", count: menuItems.filter(i => i.category === "Platters").length, pct: "25%" }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">{item.cat}</span>
                            <span className="font-semibold text-gold-400">{item.count} items</span>
                          </div>
                          <div className="w-full h-2 bg-dark-base rounded-full overflow-hidden border border-gold-400/5">
                            <div className="bg-gold-400 h-full" style={{ width: item.pct }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                TAB: RESERVATIONS
                ------------------------------------------------------------- */}
            {activeTab === "reservations" && (
              <div className="bg-dark-card border border-gold-400/10 rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-dark-base border-b border-gold-400/10 text-gold-400 uppercase tracking-wider text-[9px]">
                      <tr>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Date / Time</th>
                        <th className="p-4">Guests</th>
                        <th className="p-4">Dining Type</th>
                        <th className="p-4">Special Requests</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-400/5">
                      {reservations.map((res) => (
                        <tr key={res.id} className="hover:bg-dark-base/40">
                          <td className="p-4 space-y-1">
                            <p className="font-semibold text-[#FAF9F6]">{res.name}</p>
                            <p className="text-[10px] text-gray-500">{res.phone} • {res.email}</p>
                          </td>
                          <td className="p-4 font-serif">{res.date} at {res.time}</td>
                          <td className="p-4">{res.guestCount} Persons</td>
                          <td className="p-4 uppercase tracking-wider text-[10px] text-gold-400">{res.type || res.diningType}</td>
                          <td className="p-4 max-w-xs truncate text-gray-500 font-light">{res.notes || "None"}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-sm text-[9px] uppercase tracking-widest font-semibold border ${
                              res.status === "Confirmed"
                                ? "bg-gold-400/10 border-gold-400/30 text-gold-400"
                                : res.status === "Cancelled"
                                ? "bg-red-950/40 border-red-500/20 text-red-400"
                                : "bg-gray-800 border-gray-700 text-gray-400"
                            }`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            {res.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleResStatus(res.id, "Confirmed")}
                                  className="p-1 border border-gold-400/20 hover:border-gold-400 rounded text-gold-400 hover:text-dark-base hover:bg-gold-400 transition-luxury cursor-pointer"
                                  title="Approve Booking"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleResStatus(res.id, "Cancelled")}
                                  className="p-1 border border-red-500/20 hover:border-red-500 rounded text-red-400 hover:text-white hover:bg-red-650 transition-luxury cursor-pointer"
                                  title="Cancel Booking"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                TAB: MENU
                ------------------------------------------------------------- */}
            {activeTab === "menu" && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    onClick={() => openMenuModal()}
                    className="px-6 py-2.5 bg-gold-400 text-dark-base font-bold uppercase tracking-widest text-xs border border-gold-400 hover:bg-transparent hover:text-gold-400 transition-luxury flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Delicacy</span>
                  </button>
                </div>

                <div className="bg-dark-card border border-gold-400/10 rounded-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-dark-base border-b border-gold-400/10 text-gold-400 uppercase tracking-wider text-[9px]">
                        <tr>
                          <th className="p-4">Dish Plate</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Attributes</th>
                          <th className="p-4 text-right">Decorum Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold-400/5">
                        {menuItems.map((item) => (
                          <tr key={item.id} className="hover:bg-dark-base/40">
                            <td className="p-4 flex items-center gap-3">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover border border-gold-400/10 rounded" />
                              )}
                              <div>
                                <p className="font-serif font-semibold text-[#FAF9F6]">{item.name}</p>
                                <p className="text-[10px] text-gray-500 max-w-xs truncate">{item.shortDescription}</p>
                              </div>
                            </td>
                            <td className="p-4 font-serif text-gray-300">{item.category}</td>
                            <td className="p-4 font-semibold text-gold-400 font-serif">${item.price}</td>
                            <td className="p-4 space-x-1.5">
                              {item.tags?.includes("chef special") && (
                                <span className="bg-gold-400/10 border border-gold-400/20 text-gold-400 text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded">
                                  Chef Special
                                </span>
                              )}
                              {item.tags?.includes("spicy") && (
                                <span className="bg-red-950/20 border border-red-500/20 text-red-400 text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded">
                                  Spicy
                                </span>
                              )}
                              {item.buffetAvailabilityFlag && (
                                <span className="bg-blue-950/20 border border-blue-500/20 text-blue-400 text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded">
                                  Buffet
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => openMenuModal(item)}
                                className="p-1 border border-gold-400/20 hover:border-gold-400 rounded text-gold-400 hover:text-dark-base hover:bg-gold-400 transition-luxury cursor-pointer"
                                title="Edit Item"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMenuDelete(item.id)}
                                className="p-1 border border-red-500/20 hover:border-red-500 rounded text-red-400 hover:text-white hover:bg-red-650 transition-luxury cursor-pointer"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                TAB: ORDERS & INQUIRIES
                ------------------------------------------------------------- */}
            {activeTab === "orders" && (
              <div className="bg-dark-card border border-gold-400/10 rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-dark-base border-b border-gold-400/10 text-gold-400 uppercase tracking-wider text-[9px]">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Ordered items</th>
                        <th className="p-4">Valuation</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-400/5">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-dark-base/40">
                          <td className="p-4 font-mono font-semibold tracking-wider">{ord.id}</td>
                          <td className="p-4 space-y-1">
                            <p className="font-semibold">{ord.name}</p>
                            <p className="text-[10px] text-gray-500">{ord.phone} • {ord.email}</p>
                          </td>
                          <td className="p-4 space-y-1">
                            {ord.items?.map((item: any, idx: number) => (
                              <p key={idx} className="text-gray-400">
                                {item.name} <span className="text-[10px] text-gold-500">(x{item.qty})</span>
                              </p>
                            ))}
                          </td>
                          <td className="p-4 font-semibold text-gold-400 font-serif">${ord.total}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-sm text-[9px] uppercase tracking-widest font-semibold border ${
                              ord.status === "Delivered" || ord.status === "Preparing"
                                ? "bg-gold-400/10 border-gold-400/30 text-gold-400"
                                : "bg-gray-800 border-gray-700 text-gray-400"
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {ord.status === "Pending" && (
                              <button
                                onClick={() => handleOrderStatus(ord.id, "Preparing")}
                                className="px-3 py-1 bg-gold-400 border border-gold-400 text-dark-base text-[9px] font-bold uppercase tracking-widest transition-luxury cursor-pointer"
                              >
                                Accept Order
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                TAB: CUSTOMER INBOX
                ------------------------------------------------------------- */}
            {activeTab === "messages" && (
              <div className="grid grid-cols-1 gap-6">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-dark-card border border-gold-400/10 p-6 rounded-sm space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-serif text-base font-semibold text-gold-400">{msg.name}</h4>
                        <p className="text-[10px] text-gray-500">{msg.email} • {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "Unknown date"}</p>
                      </div>
                      <span className="bg-gold-400/10 border border-gold-400/20 text-gold-400 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                        {msg.subject || "General Inquiry"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-light whitespace-pre-wrap">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* -------------------------------------------------------------
          MENU MODAL FORM
          ------------------------------------------------------------- */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsMenuModalOpen(false)} />
          
          <div className="w-full max-w-2xl bg-dark-card border border-gold-400/25 p-8 rounded-sm space-y-6 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-gold-400/10 pb-4">
              <h3 className="font-serif text-lg font-bold text-gold-400 uppercase tracking-widest">
                {editingItem ? "Amend Gastronomy Dish" : "Create New Gastronomy Plate"}
              </h3>
              <button onClick={() => setIsMenuModalOpen(false)} className="text-gray-400 hover:text-gold-400 transition-luxury">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMenuSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Dish Name</label>
                  <input
                    type="text"
                    required
                    value={menuForm.name}
                    onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                    placeholder="E.g., Ribeye Steak Supreme"
                    className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Price ($)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={menuForm.price}
                      onChange={(e) => setMenuForm({ ...menuForm, price: parseFloat(e.target.value) || 10 })}
                      className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Category</label>
                    <select
                      value={menuForm.category}
                      onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                      className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                    >
                      <option value="Starters">Starters</option>
                      <option value="Ramen">Ramen</option>
                      <option value="Chowmein">Chowmein</option>
                      <option value="Steaks">Steaks</option>
                      <option value="Platters">Platters</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Drinks">Drinks</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Image URL</label>
                <input
                  type="text"
                  value={menuForm.image}
                  onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Short Description</label>
                <input
                  type="text"
                  required
                  value={menuForm.shortDescription}
                  onChange={(e) => setMenuForm({ ...menuForm, shortDescription: e.target.value })}
                  placeholder="Quick summary shown on cards"
                  className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Long Description / Ingredients</label>
                <textarea
                  rows={4}
                  value={menuForm.longDescription}
                  onChange={(e) => setMenuForm({ ...menuForm, longDescription: e.target.value })}
                  placeholder="Detailed text shown on preview page"
                  className="w-full bg-dark-base border border-gold-400/20 focus:border-gold-400 outline-none px-4 py-3 text-xs text-[#FAF9F6] transition-luxury resize-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-dark-base p-4 border border-gold-400/10 rounded">
                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={menuForm.chefSpecial}
                    onChange={(e) => setMenuForm({ ...menuForm, chefSpecial: e.target.checked })}
                    className="border-gold-400 text-gold-400"
                  />
                  <span>Chef Special</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={menuForm.spicy}
                    onChange={(e) => setMenuForm({ ...menuForm, spicy: e.target.checked })}
                    className="border-gold-400 text-gold-400"
                  />
                  <span>Spicy</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={menuForm.buffetAvailabilityFlag}
                    onChange={(e) => setMenuForm({ ...menuForm, buffetAvailabilityFlag: e.target.checked })}
                    className="border-gold-400 text-gold-400"
                  />
                  <span>In Buffet</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={menuForm.platterAvailabilityFlag}
                    onChange={(e) => setMenuForm({ ...menuForm, platterAvailabilityFlag: e.target.checked })}
                    className="border-gold-400 text-gold-400"
                  />
                  <span>In Platter</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gold-400 text-dark-base font-bold uppercase tracking-widest text-xs border border-gold-400 hover:bg-transparent hover:text-gold-400 transition-luxury cursor-pointer"
              >
                {editingItem ? "Apply Amendments" : "Commit Plate Creation"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
