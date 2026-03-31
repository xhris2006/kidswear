"use client";
// app/shop/cart/page.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartPageClient from "@/components/shop/CartPageClient";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          Shopping Cart
        </h1>
        <CartPageClient />
      </main>
      <Footer />
    </div>
  );
}
