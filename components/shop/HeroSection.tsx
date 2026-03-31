"use client";
// components/shop/HeroSection.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="gradient-hero overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[85vh] py-12 lg:py-0">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-2 lg:order-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md mb-6"
            >
              <span className="text-2xl">🌈</span>
              <span className="text-sm font-bold text-gray-700">
                New Summer Collection 2025
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-4"
            >
              Summer{" "}
              <span className="text-coral relative inline-block">
                Vibes
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <path
                    d="M2 8C50 2 150 2 198 8"
                    stroke="#FF6B6B"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              Holiday Mode On
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-lg sm:text-xl mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed"
            >
              Dress your little stars in the most adorable, comfortable, and
              colorful outfits for every adventure.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/shop"
                className="btn-primary text-center text-base inline-flex items-center justify-center gap-2"
                style={{ backgroundColor: "#FF6B6B" }}
              >
                <span>Shop Now</span>
                <span className="text-xl">→</span>
              </Link>
              <Link
                href="/shop?category=summer-clothing"
                className="border-2 font-bold py-3 px-6 rounded-full transition-all duration-300 text-center"
                style={{ borderColor: "#FF6B6B", color: "#FF6B6B" }}
              >
                Summer Collection
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-6 mt-10 justify-center lg:justify-start"
            >
              {[
                { value: "500+", label: "Products" },
                { value: "50k+", label: "Happy Kids" },
                { value: "4.9★", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-playfair font-bold text-2xl text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image collage */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px]">
              {/* Main image */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 -translate-x-1/2 top-0 w-64 sm:w-80 h-64 sm:h-80 rounded-3xl overflow-hidden shadow-2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80"
                  alt="Kids summer fashion"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2">
                  <p className="font-bold text-gray-900 text-sm">Summer Clothing</p>
                  <p className="text-coral text-sm font-bold">Up to 70% off</p>
                </div>
              </motion.div>

              {/* Left card */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute left-0 top-32 sm:top-40 w-36 sm:w-44 h-36 sm:h-44 rounded-2xl overflow-hidden shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80"
                  alt="Girls clothing"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <p className="absolute bottom-2 left-2 text-white text-xs font-bold">
                  Girls Collection
                </p>
              </motion.div>

              {/* Right card */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute right-0 top-40 sm:top-52 w-36 sm:w-44 h-36 sm:h-44 rounded-2xl overflow-hidden shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&q=80"
                  alt="Boys clothing"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <p className="absolute bottom-2 left-2 text-white text-xs font-bold">
                  Boys Collection
                </p>
              </motion.div>

              {/* Floating badges */}
              <motion.div
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 right-8 bg-yellow-400 text-yellow-900 font-bold text-sm px-4 py-2 rounded-full shadow-lg"
              >
                New In! ✨
              </motion.div>

              <motion.div
                animate={{ rotate: [3, -3, 3] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute bottom-8 left-8 bg-white text-gray-900 font-bold text-sm px-4 py-2 rounded-full shadow-lg border-2"
                style={{ borderColor: "#FF6B6B" }}
              >
                🚚 Free shipping $50+
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
