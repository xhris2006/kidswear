"use client";
// components/shop/CategorySection.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import { Category } from "@/types";

const categoryImages: Record<string, string> = {
  "girls-clothing":
    "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&q=80",
  "boys-clothing":
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&q=80",
  "summer-clothing":
    "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=500&q=80",
  shoes:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
  accessories:
    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500&q=80",
};

const categoryColors = [
  { bg: "from-pink-200 to-rose-300", text: "text-rose-700" },
  { bg: "from-sky-200 to-blue-300", text: "text-blue-700" },
  { bg: "from-yellow-200 to-amber-300", text: "text-amber-700" },
  { bg: "from-green-200 to-emerald-300", text: "text-emerald-700" },
  { bg: "from-violet-200 to-purple-300", text: "text-purple-700" },
];

export default function CategorySection({
  categories,
}: {
  categories: (Category & { _count?: { products: number } })[];
}) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="section-title mb-3">Shop by Category</h2>
          <p className="text-gray-500 text-lg">
            Find the perfect outfit for every occasion
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, i) => {
            const colors = categoryColors[i % categoryColors.length];
            const image = cat.image || categoryImages[cat.slug] || "";

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/shop?category=${cat.slug}`}>
                  <div className="group relative rounded-3xl overflow-hidden aspect-[3/4] shadow-md card-hover cursor-pointer">
                    <img
                      src={image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent`}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div
                        className={`inline-block bg-gradient-to-r ${colors.bg} px-3 py-1 rounded-full mb-2`}
                      >
                        <span
                          className={`text-xs font-bold ${colors.text} uppercase tracking-wide`}
                        >
                          {cat._count?.products ?? 0} items
                        </span>
                      </div>
                      <h3 className="font-playfair font-bold text-white text-lg sm:text-xl">
                        {cat.name}
                      </h3>
                    </div>
                    <div className="absolute inset-0 ring-2 ring-white/0 group-hover:ring-white/30 rounded-3xl transition-all duration-300" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
