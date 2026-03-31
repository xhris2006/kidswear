"use client";
// components/shop/ProductDetailClient.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star, Truck, RotateCcw, Shield, ChevronLeft } from "lucide-react";
import { Product } from "@/types";
import { useCart, useWishlist } from "@/hooks/useCart";
import Link from "next/link";

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes[0] || null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  const handleAddToCart = () => {
    addItem(
      product,
      quantity,
      selectedSize || undefined,
      selectedColor || undefined
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-coral transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-coral transition-colors">Shop</Link>
        <span>/</span>
        <Link
          href={`/shop?category=${product.category?.slug}`}
          className="hover:text-coral transition-colors"
        >
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold truncate max-w-[150px]">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 mb-4">
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={product.images[selectedImage] || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i ? "border-coral scale-95" : "border-gray-200"
                  }`}
                  style={selectedImage === i ? { borderColor: "#FF6B6B" } : {}}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-coral text-sm font-bold uppercase tracking-wide mb-2" style={{ color: "#FF6B6B" }}>
            {product.category?.name}
          </p>

          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200 fill-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-500 text-sm">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-playfair text-4xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-gray-400 line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
            {discount && (
              <span className="bg-red-100 text-red-600 font-bold text-sm px-3 py-1 rounded-full">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                  Size
                </span>
                <button className="text-coral text-sm font-semibold" style={{ color: "#FF6B6B" }}>
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 rounded-xl text-sm font-bold transition-all ${
                      selectedSize === size
                        ? "border-coral text-white"
                        : "border-gray-200 text-gray-700 hover:border-coral"
                    }`}
                    style={selectedSize === size ? { borderColor: "#FF6B6B", backgroundColor: "#FF6B6B", color: "white" } : {}}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <span className="font-bold text-gray-800 text-sm uppercase tracking-wide block mb-2">
                Color: <span className="font-normal text-gray-600 normal-case">{selectedColor}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 rounded-xl text-sm font-semibold transition-all ${
                      selectedColor === color
                        ? "border-coral"
                        : "border-gray-200 hover:border-coral"
                    }`}
                    style={selectedColor === color ? { borderColor: "#FF6B6B" } : {}}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">Qty</span>
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100 font-bold text-lg"
              >
                −
              </button>
              <span className="px-4 py-2 font-bold min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 hover:bg-gray-100 font-bold text-lg"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">{product.stock} in stock</span>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: "#FF6B6B" }}
            >
              <ShoppingBag className="w-5 h-5" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <button
              onClick={() => toggle(product)}
              className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                wishlisted ? "bg-red-500 border-red-500 text-white" : "border-gray-200 text-gray-700 hover:border-red-300"
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100">
            {[
              { icon: Truck, text: "Free shipping $50+" },
              { icon: RotateCcw, text: "30-day returns" },
              { icon: Shield, text: "Secure checkout" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center text-center gap-1.5">
                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-coral" style={{ color: "#FF6B6B" }} />
                </div>
                <span className="text-xs font-semibold text-gray-600">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
