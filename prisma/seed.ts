// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_NAME,
  DEFAULT_ADMIN_PASSWORD,
} from "@/lib/default-admin";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 12);
  const admin = await prisma.user.upsert({
    where: { email: DEFAULT_ADMIN_EMAIL },
    update: {
      email: DEFAULT_ADMIN_EMAIL,
      name: DEFAULT_ADMIN_NAME,
      password: adminPassword,
      role: Role.SUPER_ADMIN,
    },
    create: {
      email: DEFAULT_ADMIN_EMAIL,
      name: DEFAULT_ADMIN_NAME,
      password: adminPassword,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "girls-clothing" },
      update: {},
      create: {
        name: "Girls Clothing",
        slug: "girls-clothing",
        description: "Beautiful clothing for girls",
        image:
          "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "boys-clothing" },
      update: {},
      create: {
        name: "Boys Clothing",
        slug: "boys-clothing",
        description: "Stylish clothing for boys",
        image:
          "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "summer-clothing" },
      update: {},
      create: {
        name: "Summer Clothing",
        slug: "summer-clothing",
        description: "Perfect outfits for summer",
        image:
          "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "shoes" },
      update: {},
      create: {
        name: "Shoes",
        slug: "shoes",
        description: "Comfortable shoes for kids",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        name: "Accessories",
        slug: "accessories",
        description: "Fun accessories for kids",
        image:
          "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400",
      },
    }),
  ]);
  console.log("✅ Categories created:", categories.length);

  // Products data
  const productsData = [
    {
      name: "Rainbow Tutu Skirt",
      slug: "rainbow-tutu-skirt",
      description: "Beautiful rainbow tutu perfect for little dancers",
      price: 24.99,
      comparePrice: 34.99,
      images: [
        "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500",
      ],
      stock: 50,
      categorySlug: "girls-clothing",
      isFeatured: true,
      rating: 4.8,
      reviewCount: 24,
      sizes: ["2T", "3T", "4T", "5T", "6"],
      colors: ["Pink", "Purple", "Rainbow"],
      tags: ["skirt", "tutu", "dance", "party"],
    },
    {
      name: "Striped Adventure Tee",
      slug: "striped-adventure-tee",
      description: "Classic striped t-shirt for everyday adventures",
      price: 14.99,
      comparePrice: 19.99,
      images: [
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500",
      ],
      stock: 75,
      categorySlug: "boys-clothing",
      isFeatured: true,
      rating: 4.6,
      reviewCount: 18,
      sizes: ["2T", "3T", "4T", "5T", "6", "7", "8"],
      colors: ["Blue/White", "Red/White", "Navy/White"],
      tags: ["tshirt", "striped", "casual", "everyday"],
    },
    {
      name: "Sunshine Floral Dress",
      slug: "sunshine-floral-dress",
      description: "Sweet floral dress perfect for sunny days",
      price: 32.99,
      comparePrice: 44.99,
      images: [
        "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=500",
      ],
      stock: 30,
      categorySlug: "summer-clothing",
      isFeatured: true,
      rating: 4.9,
      reviewCount: 31,
      sizes: ["2T", "3T", "4T", "5T", "6"],
      colors: ["Yellow", "Pink", "White"],
      tags: ["dress", "floral", "summer", "girl"],
    },
    {
      name: "Gold Sparkle Sneakers",
      slug: "gold-sparkle-sneakers",
      description: "Dazzling gold sneakers that light up every step",
      price: 39.99,
      comparePrice: 54.99,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      ],
      stock: 45,
      categorySlug: "shoes",
      isFeatured: true,
      rating: 4.7,
      reviewCount: 42,
      sizes: ["4", "5", "6", "7", "8", "9", "10"],
      colors: ["Gold", "Silver", "Rose Gold"],
      tags: ["shoes", "sneakers", "sparkle", "gold"],
    },
    {
      name: "Tropical Print Shorts",
      slug: "tropical-print-shorts",
      description: "Vibrant tropical shorts for summer fun",
      price: 18.99,
      images: [
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500",
      ],
      stock: 60,
      categorySlug: "summer-clothing",
      isFeatured: false,
      rating: 4.5,
      reviewCount: 15,
      sizes: ["2T", "3T", "4T", "5T", "6", "7"],
      colors: ["Blue", "Green", "Orange"],
      tags: ["shorts", "tropical", "summer", "boy"],
    },
    {
      name: "Crown Hair Clips Set",
      slug: "crown-hair-clips-set",
      description: "Adorable crown-shaped hair clips for little princesses",
      price: 9.99,
      comparePrice: 14.99,
      images: [
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500",
      ],
      stock: 100,
      categorySlug: "accessories",
      isFeatured: true,
      rating: 4.8,
      reviewCount: 56,
      sizes: ["One Size"],
      colors: ["Gold", "Silver", "Pink"],
      tags: ["hairclip", "crown", "accessory", "girl"],
    },
    {
      name: "Cozy Denim Jacket",
      slug: "cozy-denim-jacket",
      description: "Classic denim jacket for cool days",
      price: 44.99,
      comparePrice: 59.99,
      images: [
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500",
      ],
      stock: 25,
      categorySlug: "boys-clothing",
      isFeatured: false,
      rating: 4.7,
      reviewCount: 22,
      sizes: ["3T", "4T", "5T", "6", "7", "8"],
      colors: ["Blue", "Light Blue", "Dark Blue"],
      tags: ["jacket", "denim", "boy", "cool"],
    },
    {
      name: "Ballet Flat Shoes",
      slug: "ballet-flat-shoes",
      description: "Elegant ballet flats for every occasion",
      price: 29.99,
      comparePrice: 39.99,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      ],
      stock: 35,
      categorySlug: "shoes",
      isFeatured: false,
      rating: 4.6,
      reviewCount: 28,
      sizes: ["5", "6", "7", "8", "9", "10"],
      colors: ["Pink", "White", "Black"],
      tags: ["shoes", "ballet", "flat", "elegant"],
    },
  ];

  for (const productData of productsData) {
    const { categorySlug, ...data } = productData;
    const category = categories.find((c) => c.slug === categorySlug);
    if (!category) continue;

    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        categoryId: category.id,
      },
    });
  }
  console.log("✅ Products created:", productsData.length);

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
