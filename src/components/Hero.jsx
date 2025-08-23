import React from "react";
import CheckIcon from "./CheckIcon";
import AuthCta from "./AuthCta";

export default function Hero({ nav }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-indigo-50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Your brand, on anything.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">
              Printed. Packed. Delivered.
            </span>
          </h1>
          <p className="mt-5 text-neutral-600 text-base md:text-lg max-w-xl">
            Place the order, approve a free mockup, and we’ll handle printing and white-label shipping through our pro supplier network.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button onClick={() => nav("quote")} className="px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow">
              Start with a Free Mockup
            </button>
            <button onClick={() => nav("catalog")} className="px-5 py-3 rounded-xl border border-neutral-300 hover:border-neutral-400 bg-white">
              Browse Catalog
            </button>
          </div>

          <div className="mt-6 flex items-center gap-6 text-sm text-neutral-500">
            <div className="flex items-center gap-2"><CheckIcon /> No minimum artwork fees</div>
            <div className="flex items-center gap-2"><CheckIcon /> End-to-end tracking</div>
          </div>

          {/* Auth controls live here now */}
          <AuthCta />
        </div>

        {/* Preview column */}
        <div className="relative">
          <div className="rounded-2xl border border-neutral-200 shadow-sm bg-white p-4 relative">
            <div className="aspect-video rounded-xl bg-neutral-100 grid place-items-center text-neutral-400 text-sm">
              Live product preview
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {["Hoodie", "Mug", "Tote", "Banner", "Pen", "Bottle"].map((t, i) => (
                <div key={i} className="h-20 rounded-xl bg-neutral-100 grid place-items-center text-neutral-500 text-xs border border-neutral-200">
                  {t}
                </div>
              ))}
            </div>

            {/* Chip anchored inside the card */}
            <div className="absolute bottom-4 left-4 bg-white border border-neutral-200 rounded-2xl px-3 py-2 shadow-sm hidden md:block">
              <div className="text-xs text-neutral-500">Avg. proof time</div>
              <div className="font-semibold">&lt; 24 hours</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
