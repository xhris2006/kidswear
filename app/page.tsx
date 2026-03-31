// app/page.tsx
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/shop/HeroSection";
import CategorySection from "@/components/shop/CategorySection";
import ProductGrid from "@/components/shop/ProductGrid";
import PromoBanner from "@/components/shop/PromoBanner";
import NewsletterSection from "@/components/shop/NewsletterSection";

async function getHomeData() {
  const [categories, featuredProducts, newProducts] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      take: 4,
    }),
    prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { categories, featuredProducts, newProducts };
}

export default async function HomePage() {
  const { categories, featuredProducts, newProducts } = await getHomeData();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <PromoBanner />
        <CategorySection categories={categories} />
        <ProductGrid
          title="New Collections"
          subtitle="Fresh arrivals for your little ones"
          products={newProducts as any}
        />
        <ProductGrid
          title="Best Sellers"
          subtitle="Our most loved pieces"
          products={featuredProducts as any}
          bgColor="bg-pink-50"
        />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
