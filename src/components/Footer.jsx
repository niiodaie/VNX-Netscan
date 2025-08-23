import React from "react";
import SocialLinks from "./SocialLinks";

export default function Footer({ nav }) {
  return (
    <footer className="border-t border-neutral-200 bg-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-3">
            <img src="/images/footer-logo.svg" onError={(e)=>{e.currentTarget.src="/logo.svg"}} alt="VisnecPrint logo" className="w-9 h-9 rounded-2xl" />
            <span className="font-semibold">VisnecPrint</span>
          </div>
          <p className="mt-3 text-neutral-600">
            Outsourced printing, in-house service. Your brand on anything—printed, packed, delivered.
          </p>
          <SocialLinks align="left" size={20} className="mt-4" />
        </div>

        <div>
          <div className="font-semibold mb-2">Explore</div>
          <nav aria-label="Explore navigation">
            <ul className="space-y-1 text-neutral-600">
              <li><button onClick={() => nav?.("catalog")} className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded">Catalog</button></li>
              <li><button onClick={() => nav?.("pricing")} className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded">Pricing</button></li>
              <li><button onClick={() => nav?.("quote")} className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded">Quote Builder</button></li>
            </ul>
          </nav>
        </div>

        <div>
          <div className="font-semibold mb-2">Company</div>
          <nav aria-label="Company navigation">
            <ul className="space-y-1 text-neutral-600">
              <li><button onClick={() => nav?.("about")} className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded">About</button></li>
              <li><button onClick={() => nav?.("contact")} className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded">Contact</button></li>
              <li><button onClick={() => nav?.("dashboard")} className="hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded">Dashboard</button></li>
            </ul>
          </nav>
        </div>

        <div>
          <div className="font-semibold mb-2">Get a quote</div>
          <p className="text-neutral-600">
            Send your logo and quantities—our team will reply with pricing and a free mockup.
          </p>
          <button
            onClick={() => nav?.("quote")}
            className="mt-3 px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
          >
            Request Quote
          </button>
        </div>
      </div>

      <div className="border-t border-neutral-200 py-5 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} VisnecPrint. All rights reserved.
      </div>
    </footer>
  );
}
