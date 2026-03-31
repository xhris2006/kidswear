// components/layout/Footer.tsx
import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube, Heart } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "Girls Clothing", href: "/shop?category=girls-clothing" },
    { label: "Boys Clothing", href: "/shop?category=boys-clothing" },
    { label: "Summer Collection", href: "/shop?category=summer-clothing" },
    { label: "Shoes", href: "/shop?category=shoes" },
    { label: "Accessories", href: "/shop?category=accessories" },
  ],
  Help: [
    { label: "Size Guide", href: "/size-guide" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-coral rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FF6B6B" }}>
                <span className="text-white font-playfair font-bold text-xl">K</span>
              </div>
              <span className="font-playfair font-bold text-2xl text-white">
                Kids<span style={{ color: "#FF6B6B" }}>Wear</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium children's clothing for girls, boys, and babies. Crafted with love for your little ones.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-coral transition-colors duration-200"
                  style={{ "--hover-bg": "#FF6B6B" } as any}
                >
                  <Icon className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-white mb-4 uppercase tracking-wide text-sm">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} KidsWear. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> for little ones
            </p>
            <div className="flex items-center gap-3">
              {["Visa", "MC", "PayPal", "Stripe"].map((p) => (
                <span key={p} className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
