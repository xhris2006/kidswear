"use client";
// components/shop/ProductCard.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types";
import { useCart, useWishlist } from "@/hooks/useCart";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/shop/product/${product.id}`}>
          <img
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        {discount && discount > 0 && (
          <div className="badge-sale">-{discount}%</div>
        )}
        {product.isFeatured && !discount && (
          <div className="badge-hot">HOT</div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-900 font-bold px-4 py-2 rounded-full text-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => toggle(product)}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
              wishlisted
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-500"
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => addItem(product, 1)}
            disabled={product.stock === 0}
            className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-coral transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            style={{ "--tw-bg-opacity": 1 } as any}
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <Link href={`/shop/product/${product.id}`}>
          <p className="text-xs text-coral font-bold uppercase tracking-wide mb-1">
            {product.category?.name}
          </p>
          <h3 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-2 hover:text-coral transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 my-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(product.rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-200 fill-gray-200"
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-playfair font-bold text-lg text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Sizes preview */}
        {product.sizes.length > 0 && (
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            {product.sizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="text-xs text-gray-500 border border-gray-200 rounded-md px-1.5 py-0.5"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-xs text-gray-400">+{product.sizes.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
