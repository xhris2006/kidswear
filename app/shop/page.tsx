// app/shop/page.tsx
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";
import { Suspense } from "react";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

async function getProducts(searchParams: Awaited<ShopPageProps["searchParams"]>) {
  const page = parseInt(searchParams.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: any = { isActive: true };

  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }

  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
      { tags: { has: searchParams.search } },
    ];
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {};
    if (searchParams.minPrice) where.price.gte = parseFloat(searchParams.minPrice);
    if (searchParams.maxPrice) where.price.lte = parseFloat(searchParams.maxPrice);
  }

  const sortMap: Record<string, any> = {
    newest: { createdAt: "desc" },
    price_asc: { price: "asc" },
    price_desc: { price: "desc" },
    popular: { reviewCount: "desc" },
    rating: { rating: "desc" },
  };

  const orderBy = sortMap[searchParams.sort || "newest"] || { createdAt: "desc" };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return { products, total, categories, page, limit };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = await searchParams;
  const { products, total, categories, page, limit } = await getProducts(resolvedSearchParams);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {resolvedSearchParams.search
              ? `Results for "${resolvedSearchParams.search}"`
              : resolvedSearchParams.category
              ? categories.find((c) => c.slug === resolvedSearchParams.category)?.name || "Shop"
              : "All Products"}
          </h1>
          <p className="text-gray-500">{total} products found</p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters sidebar */}
          <aside className="lg:col-span-1">
            <ShopFilters
              categories={categories}
              currentCategory={resolvedSearchParams.category}
              currentSort={resolvedSearchParams.sort}
            />
          </aside>

          {/* Products */}
          <div className="lg:col-span-3 mt-6 lg:mt-0">
            {products.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-bold text-xl text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <a
                        key={p}
                        href={`?${new URLSearchParams({
                          ...resolvedSearchParams,
                          page: p.toString(),
                        })}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
                          p === page
                            ? "text-white shadow-md"
                            : "bg-white text-gray-700 border border-gray-200 hover:border-coral"
                        }`}
                        style={p === page ? { backgroundColor: "#FF6B6B" } : {}}
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
