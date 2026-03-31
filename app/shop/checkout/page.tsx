"use client";
// app/shop/checkout/page.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CheckoutForm from "@/components/shop/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          Checkout
        </h1>
        <CheckoutForm />
      </main>
      <Footer />
    </div>
  );
}
