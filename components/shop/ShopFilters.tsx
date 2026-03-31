"use client";
// components/shop/ShopFilters.tsx
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Category } from "@/types";

interface ShopFiltersProps {
  categories: Category[];
  currentCategory?: string;
  currentSort?: string;
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function ShopFilters({
  categories,
  currentCategory,
  currentSort,
}: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Sort By</h3>
        <div className="space-y-1.5">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter("sort", opt.value)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                currentSort === opt.value
                  ? "text-white"
                  : "text-gray-600 hover:bg-pink-50 hover:text-coral"
              }`}
              style={currentSort === opt.value ? { backgroundColor: "#FF6B6B", color: "white" } : {}}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Categories</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => updateFilter("category", null)}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              !currentCategory
                ? "text-white"
                : "text-gray-600 hover:bg-pink-50 hover:text-coral"
            }`}
            style={!currentCategory ? { backgroundColor: "#FF6B6B", color: "white" } : {}}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                currentCategory === cat.slug
                  ? "text-white"
                  : "text-gray-600 hover:bg-pink-50 hover:text-coral"
              }`}
              style={currentCategory === cat.slug ? { backgroundColor: "#FF6B6B", color: "white" } : {}}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Under $15", min: "", max: "15" },
            { label: "$15–$30", min: "15", max: "30" },
            { label: "$30–$50", min: "30", max: "50" },
            { label: "Over $50", min: "50", max: "" },
          ].map((range) => (
            <button
              key={range.label}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                if (range.min) params.set("minPrice", range.min);
                else params.delete("minPrice");
                if (range.max) params.set("maxPrice", range.max);
                else params.delete("maxPrice");
                params.delete("page");
                router.push(`/shop?${params.toString()}`);
              }}
              className="px-3 py-2 border-2 border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-coral hover:text-coral transition-colors"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {(currentCategory || currentSort || searchParams.get("minPrice") || searchParams.get("maxPrice")) && (
        <button
          onClick={() => router.push("/shop")}
          className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters & Sort
        </button>
        {mobileOpen && (
          <div className="mt-4 bg-white rounded-2xl border border-gray-200 p-5 shadow-lg">
            <FilterContent />
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-24">
        <h2 className="font-playfair font-bold text-lg text-gray-900 mb-5">Filter Products</h2>
        <FilterContent />
      </div>
    </>
  );
}
