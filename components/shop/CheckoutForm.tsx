"use client";
// components/shop/CheckoutForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutInput } from "@/lib/validations";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, CreditCard, Truck } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckoutForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const cartTotal = total();
  const shipping = cartTotal >= 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + shipping + tax;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingEmail: session?.user?.email || "",
      shippingName: session?.user?.name || "",
      shippingCountry: "United States",
    },
  });

  const onSubmit = async (data: CheckoutInput) => {
    if (!session) {
      router.push("/auth/login?redirect=/shop/checkout");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
          })),
        }),
      });

      if (!res.ok) throw new Error("Order failed");
      const order = await res.json();
      clearCart();
      toast.success("🎉 Order placed successfully!");
      router.push(`/shop/orders?success=${order.id}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="lg:grid lg:grid-cols-3 lg:gap-10">
        {/* Form fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-lg text-gray-900 mb-5 flex items-center gap-2">
              <Truck className="w-5 h-5 text-coral" style={{ color: "#FF6B6B" }} />
              Shipping Information
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">Full Name *</label>
                <input
                  {...register("shippingName")}
                  className="input-field"
                  placeholder="Jane Doe"
                />
                {errors.shippingName && (
                  <p className="text-red-500 text-xs mt-1">{errors.shippingName.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">Email *</label>
                <input
                  {...register("shippingEmail")}
                  type="email"
                  className="input-field"
                  placeholder="jane@example.com"
                />
                {errors.shippingEmail && (
                  <p className="text-red-500 text-xs mt-1">{errors.shippingEmail.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">Phone</label>
                <input
                  {...register("shippingPhone")}
                  className="input-field"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">Country *</label>
                <input
                  {...register("shippingCountry")}
                  className="input-field"
                  placeholder="United States"
                />
                {errors.shippingCountry && (
                  <p className="text-red-500 text-xs mt-1">{errors.shippingCountry.message}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-bold text-gray-700 block mb-1.5">Address *</label>
                <input
                  {...register("shippingAddress")}
                  className="input-field"
                  placeholder="123 Main Street, Apt 4B"
                />
                {errors.shippingAddress && (
                  <p className="text-red-500 text-xs mt-1">{errors.shippingAddress.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">City *</label>
                <input
                  {...register("shippingCity")}
                  className="input-field"
                  placeholder="New York"
                />
                {errors.shippingCity && (
                  <p className="text-red-500 text-xs mt-1">{errors.shippingCity.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">ZIP Code *</label>
                <input
                  {...register("shippingZip")}
                  className="input-field"
                  placeholder="10001"
                />
                {errors.shippingZip && (
                  <p className="text-red-500 text-xs mt-1">{errors.shippingZip.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment - Mock */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-lg text-gray-900 mb-5 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-coral" style={{ color: "#FF6B6B" }} />
              Payment
            </h2>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-sm text-yellow-800 font-medium">
              🔒 This is a demo checkout. No real payment will be processed.
              <br />Connect Stripe via <code>STRIPE_SECRET_KEY</code> for live payments.
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-bold text-gray-700 block mb-1.5">Card Number</label>
                <input
                  className="input-field bg-gray-50"
                  placeholder="4242 4242 4242 4242"
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">Expiry</label>
                <input className="input-field bg-gray-50" placeholder="MM / YY" disabled />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">CVC</label>
                <input className="input-field bg-gray-50" placeholder="123" disabled />
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="mt-6 lg:mt-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="font-playfair text-xl font-bold text-gray-900 mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="flex gap-3 items-center"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 mb-5">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold text-lg pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="font-playfair">${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-60"
              style={{ backgroundColor: "#FF6B6B" }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
