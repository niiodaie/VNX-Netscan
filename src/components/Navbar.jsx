// src/components/Navbar.jsx
import React from "react";
import { siteConfig } from "../lib/siteConfig";

export default function Navbar({ nav }) {
  const brand = siteConfig?.brandName || "VisnecPrint";

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b border-neutral-200" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand / Home */}
        <div
          className="flex items-center gap-3 shrink-0 min-w-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
          onClick={() => nav("home")}
          onKeyDown={(e) => e.key === "Enter" && nav("home")}
          tabIndex={0}
          role="button"
          aria-label="Go to homepage"
        >
          <img src="/logo-icon.svg" alt={`${brand} logo`} className="w-9 h-9 rounded-lg object-contain" />
          {/* truncate prevents overlap with first nav item */}
          <span className="font-semibold text-lg tracking-tight truncate max-w-[160px] sm:max-w-[200px]">
            {brand}
          </span>
        </div>

        {/* Primary nav centered; takes available space */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-8 text-sm" role="navigation" aria-label="Main navigation">
          <button onClick={() => nav("catalog")}   className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-2 py-1">Catalog</button>
          <button onClick={() => nav("pricing")}   className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-2 py-1">Pricing</button>
          <button onClick={() => nav("quote")}     className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-2 py-1">Quote Builder</button>
          <button onClick={() => nav("dashboard")} className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-2 py-1">Dashboard</button>
          <button onClick={() => nav("about")}     className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-2 py-1">About</button>
          <button onClick={() => nav("contact")}   className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-2 py-1">Contact</button>
          <button onClick={() => nav("login")}     className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-2 py-1">Login</button>
        </nav>

        {/* Right CTA only (no auth here) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => nav("quote")}
            className="h-10 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm whitespace-nowrap"
          >
            Get Free Mockup
          </button>
        </div>
      </div>
    </header>
  );
}
