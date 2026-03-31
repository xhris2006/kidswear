"use client";
// components/layout/Navbar.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingBag,
  Search,
  Heart,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=girls-clothing", label: "Girls" },
  { href: "/shop?category=boys-clothing", label: "Boys" },
  { href: "/shop?category=summer-clothing", label: "Summer", hot: true },
  { href: "/shop?category=shoes", label: "Shoes" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const itemCount = useCart((s) => s.itemCount);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const count = itemCount();

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        {/* Top bar */}
        <div className="bg-gray-900 text-white text-xs text-center py-1.5 px-4">
          <span>🎉 Free shipping on orders over $50 | Use code: </span>
          <span className="font-bold text-yellow-300">KIDSLOVE</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 bg-coral rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-playfair font-bold text-lg">K</span>
              </div>
              <span className="font-playfair font-bold text-xl text-gray-900 hidden sm:block">
                Kids<span className="text-coral">Wear</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link text-sm flex items-center gap-1"
                >
                  {link.label}
                  {link.hot && (
                    <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      HOT
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-pink-50 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 hover:bg-pink-50 rounded-full transition-colors hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 text-gray-700" />
              </Link>

              {/* Cart */}
              <Link
                href="/shop/cart"
                className="p-2 hover:bg-pink-50 rounded-full transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 text-gray-700" />
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px] text-center leading-none"
                  >
                    {count > 99 ? "99+" : count}
                  </motion.span>
                )}
              </Link>

              {/* User menu */}
              {session ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 p-2 hover:bg-pink-50 rounded-full transition-colors"
                  >
                    <div className="w-7 h-7 bg-coral rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <ChevronDown className="w-3 h-3 text-gray-600" />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                      >
                        <div className="p-3 border-b border-gray-100">
                          <p className="font-bold text-gray-900 text-sm truncate">
                            {session.user?.name}
                          </p>
                          <p className="text-gray-500 text-xs truncate">
                            {session.user?.email}
                          </p>
                        </div>
                        <div className="p-1">
                          <Link
                            href="/shop/orders"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 rounded-xl"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <ShoppingBag className="w-4 h-4" /> My Orders
                          </Link>
                          {(session.user as any)?.role === "ADMIN" && (
                            <Link
                              href="/admin/dashboard"
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 rounded-xl"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <LayoutDashboard className="w-4 h-4" /> Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              signOut();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden sm:flex items-center gap-1.5 bg-coral text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-red-500 transition-colors"
                >
                  <User className="w-4 h-4" /> Login
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 hover:bg-pink-50 rounded-full transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 py-2.5 px-3 text-gray-700 hover:bg-pink-50 hover:text-coral rounded-xl font-semibold transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                    {link.hot && (
                      <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        HOT
                      </span>
                    )}
                  </Link>
                ))}
                <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
                  {session ? (
                    <>
                      <Link
                        href="/shop/orders"
                        className="flex items-center gap-2 py-2.5 px-3 text-gray-700 hover:bg-pink-50 rounded-xl font-semibold"
                        onClick={() => setMenuOpen(false)}
                      >
                        <ShoppingBag className="w-4 h-4" /> My Orders
                      </Link>
                      {(session.user as any)?.role === "ADMIN" && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-2 py-2.5 px-3 text-gray-700 hover:bg-pink-50 rounded-xl font-semibold"
                          onClick={() => setMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2 py-2.5 px-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="flex items-center gap-2 py-2.5 px-3 text-coral hover:bg-pink-50 rounded-xl font-bold"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User className="w-4 h-4" /> Login / Register
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSearchOpen(false);
            }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <form
                action="/shop"
                className="flex items-center gap-3 p-4"
                onSubmit={() => setSearchOpen(false)}
              >
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for dresses, shoes, accessories..."
                  className="flex-1 text-lg outline-none text-gray-800 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
              <div className="px-4 pb-4">
                <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
                  Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Summer dress",
                    "Girls skirt",
                    "Boys tshirt",
                    "Baby shoes",
                    "Hair clips",
                  ].map((term) => (
                    <a
                      key={term}
                      href={`/shop?search=${encodeURIComponent(term)}`}
                      className="px-3 py-1.5 bg-pink-50 text-coral text-sm font-semibold rounded-full hover:bg-pink-100 transition-colors"
                      onClick={() => setSearchOpen(false)}
                    >
                      {term}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16 mt-6" />
    </>
  );
}
