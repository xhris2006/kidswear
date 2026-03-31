"use client";
// components/shop/NewsletterSection.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("🎉 You're subscribed! Welcome to the KidsWear family!");
    setEmail("");
    setLoading(false);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-pink-50 to-purple-50" style={{ background: "linear-gradient(135deg, rgba(255,107,107,0.1) 0%, #fff5f9 50%, #f5f0ff 100%)" }} />
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-40 blur-2xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-200 rounded-full opacity-40 blur-2xl" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-coral" style={{ color: "#FF6B6B" }} />
          </div>

          <h2 className="section-title mb-4">Join the KidsWear Family</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Subscribe for exclusive deals, new arrivals, and 10% off your first order!
            No spam, just cute kids fashion. 🌈
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address..."
              className="flex-1 bg-white border-2 border-gray-200 rounded-full px-5 py-3 text-gray-800 focus:outline-none focus:border-coral font-medium"
              style={{ "--tw-border-opacity": 1 } as any}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 text-white font-bold px-6 py-3 rounded-full transition-all hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-70"
              style={{ backgroundColor: "#FF6B6B" }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" /> Subscribe
                </>
              )}
            </button>
          </form>

          <p className="text-gray-400 text-sm mt-4">
            Join 50,000+ parents who trust KidsWear. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
