import React from "react";

export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h2 className="text-2xl md:text-3xl font-bold text-center">About VisPrint</h2>
      <p className="text-neutral-600 mt-4 text-lg leading-relaxed">
        VisPrint was founded on the principle that custom printing should be easy, accessible, and high-quality. We connect businesses and individuals with a vast network of professional printers, ensuring your brand assets are produced perfectly, every time. Our streamlined process handles everything from design approval to white-label shipping, so you can focus on what you do best.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <div className="text-4xl font-bold text-indigo-600">1000+</div>
          <div className="text-neutral-600 text-sm">SKUs available</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-indigo-600">&lt; 24h</div>
          <div className="text-neutral-600 text-sm">Average proof time</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-indigo-600">3-7d</div>
          <div className="text-neutral-600 text-sm">Production turnaround</div>
        </div>
      </div>
      <p className="text-neutral-600 mt-8 text-lg leading-relaxed">
        Our mission is to simplify the complex world of custom merchandise. Whether you need branded apparel for your team, promotional items for an event, or unique gifts for clients, VisPrint is your trusted partner. We pride ourselves on exceptional service, competitive pricing, and a commitment to delivering products that make your brand shine.
      </p>
    </section>
  );
}

