"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/deployments", label: "Deployments" },
  { href: "/services", label: "Services" },
  { href: "/regressions", label: "Regressions" },
  { href: "/signals", label: "Signals" },
  { href: "/usage", label: "Usage" },
  { href: "/settings", label: "Settings" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-line bg-char/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl italic text-bone">
            Heatrace<span className="text-spark">.</span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    isActive
                      ? "bg-ember/10 text-bone border border-ember/30"
                      : "text-ash hover:text-bone hover:bg-char-2"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}