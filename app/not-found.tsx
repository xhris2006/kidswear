// app/not-found.tsx
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="text-9xl mb-6">🧸</div>
        <h1 className="font-playfair text-5xl font-bold text-gray-900 mb-3">404</h1>
        <h2 className="font-playfair text-2xl font-bold text-gray-700 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-500 text-lg max-w-md mb-8">
          Looks like this page went on an adventure. Let's find you something cute instead!
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-2xl hover:shadow-lg hover:scale-105 transition-all"
            style={{ backgroundColor: "#FF6B6B" }}
          >
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-2xl border-2 hover:border-coral transition-colors"
            style={{ borderColor: "#FF6B6B", color: "#FF6B6B" }}
          >
            Browse Shop
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
