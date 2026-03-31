"use client";
// components/shop/ProductGrid.tsx
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Product } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProductGridProps {
  title: string;
  subtitle?: string;
  products: Product[];
  bgColor?: string;
}

export default function ProductGrid({
  title,
  subtitle,
  products,
  bgColor = "bg-white",
}: ProductGridProps) {
  return (
    <section className={`py-16 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="section-title mb-2">{title}</h2>
            {subtitle && <p className="text-gray-500 text-lg">{subtitle}</p>}
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-coral font-bold hover:gap-3 transition-all duration-200"
            style={{ color: "#FF6B6B" }}
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-xl font-semibold">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-coral font-bold"
            style={{ color: "#FF6B6B" }}
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
