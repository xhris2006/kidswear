// types/index.ts
export type Role = "USER" | "ADMIN";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  images: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  sizes: string[];
  colors: string[];
  tags: string[];
  categoryId: string;
  category?: Category;
  createdAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  size: string | null;
  color: string | null;
  product: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  shippingName: string;
  shippingEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  createdAt: Date;
  user?: User;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  size: string | null;
  color: string | null;
  product: Product;
}

// Store cart item (client-side)
export interface StoreCartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
  topProducts: Array<Product & { _count: { orderItems: number } }>;
}
