# 🧒 KidsWear Store

A full-featured e-commerce application for children's and baby clothing, built with Next.js 15, TypeScript, TailwindCSS, Prisma/Supabase, Auth.js, and Stripe.

![KidsWear Store](https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=1200&q=80)

---

## ✨ Features

### 🛍️ Storefront
- **Mobile-first** responsive design (1 col → 2-3 → 4 columns)
- Hero section with animated floating images
- Category browsing (Girls, Boys, Summer, Shoes, Accessories)
- Product grid with filtering, sorting, and pagination
- Product detail page with size/color selector
- Full-text search overlay
- Promo banners & newsletter signup

### 🛒 Shopping
- Persistent cart (localStorage via Zustand)
- Wishlist (localStorage)
- Checkout with shipping form
- Order history for customers
- Real-time stock updates on purchase

### 🔐 Authentication
- Email/password registration & login
- Google OAuth
- JWT sessions via Auth.js v5
- Role-based access: `USER` / `ADMIN`
- Default admin: `diorrebero90@icloud.com`

### 🖥️ Admin Dashboard
- **Dashboard** — Revenue, orders, products, users stats + recent orders
- **Products** — Full CRUD: create, edit, delete, toggle active/featured
- **Orders** — View all orders, update status (Pending → Paid → Shipped → Delivered)
- **Users** — List all users, promote/demote to Admin role

### ⚡ Performance & DX
- Next.js 15 App Router with Server Components
- Prisma ORM with PostgreSQL (Supabase)
- Zod validation on all API routes
- React Hook Form for all forms
- Framer Motion animations
- React Hot Toast notifications
- Lazy image loading
- Lighthouse 90+ target

---

## 🗂️ Project Structure

```
kidswear/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   # Auth.js handler
│   │   │   └── register/route.ts        # Registration endpoint
│   │   ├── products/route.ts            # Public products API
│   │   ├── orders/route.ts              # Customer orders API
│   │   └── admin/
│   │       ├── products/route.ts        # Admin products CRUD
│   │       ├── products/[id]/route.ts
│   │       ├── orders/route.ts          # Admin orders management
│   │       ├── orders/[id]/route.ts
│   │       └── users/route.ts           # Admin users management
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── shop/
│   │   ├── page.tsx                     # Shop listing with filters
│   │   ├── product/[id]/page.tsx        # Product detail
│   │   ├── cart/page.tsx                # Shopping cart
│   │   ├── checkout/page.tsx            # Checkout form
│   │   └── orders/page.tsx              # Customer order history
│   ├── admin/
│   │   ├── dashboard/page.tsx
│   │   ├── products/page.tsx
│   │   ├── orders/page.tsx
│   │   └── users/page.tsx
│   ├── wishlist/page.tsx
│   ├── layout.tsx                       # Root layout (fonts, toaster)
│   ├── page.tsx                         # Homepage
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                   # Responsive navbar + search overlay
│   │   └── Footer.tsx
│   ├── shop/
│   │   ├── HeroSection.tsx              # Animated hero with floating images
│   │   ├── PromoBanner.tsx              # 3-column promo cards
│   │   ├── CategorySection.tsx          # Category cards grid
│   │   ├── ProductCard.tsx              # Product card with cart/wishlist
│   │   ├── ProductGrid.tsx              # Responsive product grid
│   │   ├── ProductDetailClient.tsx      # Full product detail client
│   │   ├── ShopFilters.tsx              # Sidebar filters (sort, category, price)
│   │   ├── CartPageClient.tsx           # Cart page with totals
│   │   ├── CheckoutForm.tsx             # Checkout with RHF + Zod
│   │   └── NewsletterSection.tsx
│   └── admin/
│       ├── AdminLayout.tsx              # Sidebar + mobile nav
│       ├── StatsCard.tsx
│       ├── RecentOrdersTable.tsx
│       ├── AdminProductsClient.tsx      # Products CRUD with modal
│       ├── AdminOrdersClient.tsx        # Orders with status update
│       └── AdminUsersClient.tsx         # Users with role toggle
├── hooks/
│   └── useCart.ts                       # Zustand cart + wishlist stores
├── lib/
│   ├── auth.ts                          # Auth.js configuration
│   ├── prisma.ts                        # Prisma client singleton
│   ├── stripe.ts                        # Stripe client
│   └── validations.ts                   # Zod schemas
├── prisma/
│   ├── schema.prisma                    # Database schema
│   └── seed.ts                          # Seed data (admin + 8 products)
├── types/
│   └── index.ts                         # TypeScript interfaces
├── .env.example                         # Environment variables template
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (Supabase recommended)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/kidswear-store.git
cd kidswear-store
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

### 3. Setup Database

```bash
# Push schema to your database
npm run db:push

# Seed with sample data + admin user
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin login:**
- Email: `diorrebero90@icloud.com`
- Password: `Admin@123456`

---

## 🗄️ Database Setup (Supabase)

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to initialize (~2 minutes)

### 2. Get Connection Strings
In your Supabase dashboard → **Settings → Database**:

- **For `DATABASE_URL`** (runtime): Use the **Transaction pooler** URL
  - Format: `postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`
  - Port: **6543**

- **For `DIRECT_URL`** (migrations): Use the **Session pooler** or direct connection
  - Port: **5432**

> ⚠️ **Important**: Always use the pooler URL for serverless/Vercel deployments to avoid "connection refused" errors (IPv6 issues with direct connections).

### 3. Update `prisma/schema.prisma`

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // Add this for migrations
}
```

---

## 💳 Stripe Integration

### Setup
1. Create account at [stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard
3. Add to `.env.local`:
   ```env
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

### Enable Webhooks (Production)
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Add to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

> **Note**: The current checkout uses a mock payment flow. To enable real Stripe Checkout, replace the order creation in `CheckoutForm.tsx` with a Stripe Checkout Session API call.

---

## 🖼️ Image Upload (Cloudinary)

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Copy your Cloud Name, API Key, and API Secret
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```
4. In the Admin → Products modal, replace the image URL input with the `<CldUploadWidget>` component from `next-cloudinary`:
   ```tsx
   import { CldUploadWidget } from 'next-cloudinary';
   ```

---

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project → Enable Google+ API
3. Create OAuth 2.0 credentials:
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Add to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="xxx"
   ```

---

## ☁️ Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/kidswear-store.git
git push -u origin main
```

### 2. Import to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Add all environment variables from `.env.example`
4. Set `NEXTAUTH_URL` to your Vercel deployment URL: `https://your-app.vercel.app`

### 3. Configure Supabase for Production
- In Supabase: **Settings → Auth → URL Configuration**
  - Add Site URL: `https://your-app.vercel.app`
  - Add Redirect URL: `https://your-app.vercel.app/api/auth/callback/google`

### 4. Run Migrations on Production
```bash
# Set DATABASE_URL to your production Supabase URL
npx prisma db push
npx tsx prisma/seed.ts
```

### Vercel Environment Variables Checklist
| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | ✅ | Supabase pooler URL (port 6543) |
| `DIRECT_URL` | ✅ | Supabase direct URL (port 5432) |
| `AUTH_SECRET` | ✅ | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | Your Vercel URL |
| `GOOGLE_CLIENT_ID` | Optional | For Google login |
| `GOOGLE_CLIENT_SECRET` | Optional | For Google login |
| `STRIPE_SECRET_KEY` | Optional | For payments |
| `STRIPE_PUBLISHABLE_KEY` | Optional | For payments |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Optional | For image upload |

---

## 📱 Responsive Breakpoints

| Screen | Columns | Notes |
|---|---|---|
| Mobile (`< 640px`) | 2 cols | Compact cards, burger menu |
| Tablet (`640–1024px`) | 2–3 cols | Expanded layout |
| Desktop (`> 1024px`) | 4 cols | Full sidebar, horizontal nav |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `coral` | `#FF6B6B` | Primary CTA, links, accents |
| `gray-900` | `#111827` | Headings, dark elements |
| `gray-50` | `#F9FAFB` | Page backgrounds |
| Font Display | Playfair Display | Headings, prices, brand |
| Font Body | Nunito | Body text, UI elements |

---

## 🛠️ Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run db:push      # Push Prisma schema to DB
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio (DB GUI)
```

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | TailwindCSS |
| Database ORM | Prisma |
| Database | PostgreSQL (Supabase) |
| Authentication | Auth.js v5 (NextAuth) |
| Validation | Zod |
| Forms | React Hook Form |
| State | Zustand (cart/wishlist) |
| Animations | Framer Motion |
| Payments | Stripe |
| Images | Cloudinary / next-cloudinary |
| Notifications | React Hot Toast |
| Deployment | Vercel |

---

## 🔒 Security

- Passwords hashed with `bcryptjs` (12 rounds)
- JWT sessions with `Auth_SECRET`
- All admin routes protected with role check
- Zod validation on all API inputs
- CSRF protection via Auth.js
- HTTP-only cookies for session tokens

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use for personal and commercial projects.

---

## 👨‍💻 Author

**Xhris Dior** — [@xhris84](https://xhris84.netlify.app)

> Built with ❤️ for little ones
