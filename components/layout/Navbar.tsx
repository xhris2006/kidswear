"use client";
// components/layout/Navbar.tsx
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { isAdminRole } from "@/lib/roles";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=girls-clothing", label: "Girls" },
  { href: "/shop?category=boys-clothing", label: "Boys" },
  { href: "/shop?category=summer-clothing", label: "Summer" },
  { href: "/shop?category=shoes", label: "Shoes" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const itemCount = useCart((s) => s.itemCount);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const count = itemCount();

  return (
    <>
      <header className="sticky top-0 z-50">
        <div className="bg-gray-950 px-4 py-2 text-center text-[11px] font-semibold tracking-[0.12em] text-white uppercase">
          Free shipping over $50
        </div>

        <div
          className={`border-b border-black/5 bg-white/95 backdrop-blur transition-all ${
            isCompact ? "shadow-sm" : ""
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMenuOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral shadow-md">
                  <span className="font-playfair text-lg font-bold text-white">K</span>
                </div>
                <div className="leading-none">
                  <p className="font-playfair text-xl font-bold text-gray-900">KidsWear</p>
                  <p className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 sm:block">
                    Little looks, big joy
                  </p>
                </div>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-gray-700 transition-colors hover:text-coral"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link
                href="/wishlist"
                className="hidden sm:inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Link>

              <Link
                href="/shop/cart"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </Link>

              {session ? (
                <button
                  onClick={() => setMenuOpen(true)}
                  className="inline-flex h-11 min-w-[44px] items-center justify-center rounded-2xl bg-gray-900 px-3 text-sm font-bold text-white"
                >
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden sm:inline-flex items-center gap-2 rounded-2xl bg-coral px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-red-500"
                >
                  <User className="h-4 w-4" /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setMenuOpen(false);
            }}
          >
            <motion.aside
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              className="flex h-full w-[88vw] max-w-sm flex-col bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                <div>
                  <p className="font-playfair text-2xl font-bold text-gray-900">KidsWear</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                    Navigation
                  </p>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-5">
                <nav className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-4 py-4 text-base font-semibold text-gray-800 transition-colors hover:bg-pink-50 hover:text-coral"
                    >
                      <span>{link.label}</span>
                      <span className="text-xs uppercase tracking-[0.16em] text-gray-300">Go</span>
                    </Link>
                  ))}
                </nav>

                <div className="mt-6 rounded-3xl bg-gray-50 p-4">
                  {session ? (
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">{session.user?.name}</p>
                      <p className="text-sm text-gray-500">{session.user?.email}</p>
                      <Link
                        href="/shop/orders"
                        onClick={() => setMenuOpen(false)}
                        className="mt-3 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-800"
                      >
                        <ShoppingBag className="h-4 w-4" /> My Orders
                      </Link>
                      {isAdminRole((session.user as any)?.role) && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-800"
                        >
                          <LayoutDashboard className="h-4 w-4" /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex w-full items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-red-600"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500">Sign in to track orders and manage your account.</p>
                      <Link
                        href="/auth/login"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-coral px-4 py-3 text-sm font-bold text-white"
                      >
                        <User className="h-4 w-4" /> Login / Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm px-4 pt-20"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSearchOpen(false);
            }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <form action="/shop" className="flex items-center gap-3 p-4" onSubmit={() => setSearchOpen(false)}>
                <Search className="h-5 w-5 flex-shrink-0 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for dresses, shoes, accessories..."
                  className="flex-1 text-base outline-none text-gray-800 placeholder-gray-400 sm:text-lg"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
              <div className="px-4 pb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Summer dress", "Girls skirt", "Boys tshirt", "Baby shoes", "Hair clips"].map((term) => (
                    <a
                      key={term}
                      href={`/shop?search=${encodeURIComponent(term)}`}
                      className="rounded-full bg-pink-50 px-3 py-2 text-sm font-semibold text-coral transition-colors hover:bg-pink-100"
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
    </>
  );
}
