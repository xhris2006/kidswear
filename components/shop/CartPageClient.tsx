"use client";
// components/shop/CartPageClient.tsx
import { useCart } from "@/hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPageClient() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const cartTotal = total();
  const shipping = cartTotal >= 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-8">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-lg hover:scale-105"
          style={{ backgroundColor: "#FF6B6B" }}
        >
          <ShoppingBag className="w-5 h-5" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-10">
      {/* Items */}
      <div className="lg:col-span-2 space-y-4">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={`${item.product.id}-${item.size}-${item.color}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              className="bg-white rounded-2xl p-4 sm:p-5 flex gap-4 shadow-sm"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={item.product.images[0] || "/placeholder.jpg"}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/shop/product/${item.product.id}`}
                      className="font-bold text-gray-900 hover:text-coral line-clamp-2 text-sm sm:text-base"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {item.size && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                          Size: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                          {item.color}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1, item.size, item.color)
                      }
                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1.5 font-bold text-sm min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)
                      }
                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-playfair font-bold text-lg text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          onClick={clearCart}
          className="text-sm text-red-400 hover:text-red-600 font-semibold flex items-center gap-1.5 mt-2"
        >
          <Trash2 className="w-4 h-4" /> Clear Cart
        </button>
      </div>

      {/* Order summary */}
      <div className="mt-8 lg:mt-0">
        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
          <h2 className="font-playfair text-xl font-bold text-gray-900 mb-5">
            Order Summary
          </h2>

          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({items.length} items)</span>
              <span className="font-semibold">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (8%)</span>
              <span className="font-semibold">${tax.toFixed(2)}</span>
            </div>
            {cartTotal < 50 && (
              <p className="text-xs text-orange-500 font-semibold">
                Add ${(50 - cartTotal).toFixed(2)} more for free shipping!
              </p>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4 mb-6">
            <div className="flex justify-between text-gray-900">
              <span className="font-bold text-lg">Total</span>
              <span className="font-playfair font-bold text-2xl">
                ${orderTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <Link
            href="/shop/checkout"
            className="w-full flex items-center justify-center gap-2 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95"
            style={{ backgroundColor: "#FF6B6B" }}
          >
            Checkout <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/shop"
            className="w-full flex items-center justify-center mt-3 text-gray-600 font-semibold py-3 rounded-2xl border-2 border-gray-200 hover:border-coral transition-colors text-sm"
          >
            Continue Shopping
          </Link>

          {/* Promo code */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-sm font-bold text-gray-700 mb-2">Promo Code</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code"
                className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-coral"
              />
              <button className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-700 transition-colors">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
