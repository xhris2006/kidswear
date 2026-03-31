"use client";
// app/wishlist/page.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useWishlist } from "@/hooks/useCart";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          My Wishlist
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="font-bold text-xl text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save your favorite items and find them here later.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-white font-bold px-6 py-3 rounded-2xl"
              style={{ backgroundColor: "#FF6B6B" }}
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
