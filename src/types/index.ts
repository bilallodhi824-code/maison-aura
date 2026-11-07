export interface MenuItem {
  id: string;
  name: string;
  slug?: string;
  category: string;
  shortDescription: string;
  longDescription?: string;
  price: number;
  image: string;
  tags?: string[];
  availabilityStatus?: boolean;
  featuredStatus?: boolean;
  buffetAvailabilityFlag?: boolean;
  platterAvailabilityFlag?: boolean;
  ingredients?: string[];
  servingSize?: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guestCount: number;
  type?: string;
  diningType?: string;
  notes?: string;
  status: "Confirmed" | "Cancelled" | "Pending";
  createdAt: string;
  preorderItems?: { name: string; qty: number; price: number }[] | null;
  preorderTotal?: number | null;
}

export interface BuffetPackage {
  id: string;
  name: string;
  tag?: string;
  price: number;
  timings?: string;
  time?: string;
  description?: string;
  inclusions?: string[];
  highlights?: string[];
  image: string;
  active: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  tag: string;
  code: string;
  active: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface OrderInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  reservationId?: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  role?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  category?: string;
}

