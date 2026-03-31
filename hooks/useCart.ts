// hooks/useCart.ts
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, StoreCartItem } from "@/types";
import toast from "react-hot-toast";

interface CartStore {
  items: StoreCartItem[];
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, size, color) => {
        const items = get().items;
        const existing = items.find(
          (i) =>
            i.product.id === product.id &&
            i.size === size &&
            i.color === color
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id && i.size === size && i.color === color
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product, quantity, size, color }] });
        }
        toast.success(`${product.name} added to cart!`);
      },
      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (i) =>
              !(i.product.id === productId && i.size === size && i.color === color)
          ),
        });
      },
      updateQuantity: (productId, quantity, size, color) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) =>
            i.product.id === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        ),
      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "kidswear-cart" }
  )
);

// Wishlist store
interface WishlistStore {
  items: Product[];
  toggle: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.find((i) => i.id === product.id);
        if (exists) {
          set({ items: get().items.filter((i) => i.id !== product.id) });
          toast("Removed from wishlist");
        } else {
          set({ items: [...get().items, product] });
          toast.success("Added to wishlist!");
        }
      },
      isWishlisted: (productId) =>
        get().items.some((i) => i.id === productId),
    }),
    { name: "kidswear-wishlist" }
  )
);
