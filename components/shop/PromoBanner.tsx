"use client";
// components/shop/PromoBanner.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import { Truck, RotateCcw, Tag } from "lucide-react";

const banners = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On all orders over $50",
    bg: "from-pink-100 to-pink-200",
    iconBg: "bg-pink-400",
    img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=300&q=80",
  },
  {
    icon: Tag,
    title: "New Style Fashion",
    subtitle: "Up to 70% off",
    highlight: "70%",
    bg: "from-yellow-100 to-yellow-200",
    iconBg: "bg-yellow-400",
    img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=300&q=80",
  },
  {
    icon: RotateCcw,
    title: "Free Returns",
    subtitle: "Anything with your pleasure",
    bg: "from-sky-100 to-sky-200",
    iconBg: "bg-sky-400",
    img: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=300&q=80",
  },
];

export default function PromoBanner() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {banners.map((banner, i) => {
            const Icon = banner.icon;
            return (
              <motion.div
                key={banner.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-gradient-to-r ${banner.bg} rounded-2xl overflow-hidden p-6 flex items-center gap-4 cursor-pointer group card-hover`}
              >
                <div className="flex-1">
                  <h3 className="font-playfair font-bold text-xl text-gray-800">
                    {banner.highlight ? (
                      <>
                        <span className="text-3xl text-coral">{banner.highlight}</span>{" "}
                        <span className="text-lg">Up to off</span>
                      </>
                    ) : (
                      banner.title
                    )}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{banner.subtitle}</p>
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={banner.img}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
