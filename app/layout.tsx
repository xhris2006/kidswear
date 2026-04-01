// app/layout.tsx
import type { Metadata } from "next";
import { Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionProvider from "@/components/layout/SessionProvider";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KidsWear - Fashion for Little Ones",
    template: "%s | KidsWear",
  },
  description:
    "Premium children's clothing for girls, boys, and babies. Summer collections, everyday wear & more.",
  keywords: ["kids clothing", "children fashion", "baby clothes", "kids store"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kidswear.store",
    siteName: "KidsWear",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable} ${playfair.variable}`}>
      <body className="font-nunito bg-white text-gray-900 antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              fontFamily: "var(--font-nunito)",
              fontWeight: 600,
            },
          }}
        />
      </body>
    </html>
  );
}
