import React from "react";

export default function USPStrip() {
  return (
    <section className="bg-neutral-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-around text-center">
        <div className="mb-4 md:mb-0">
          <h3 className="text-2xl font-bold">Quality Products</h3>
          <p className="text-neutral-300">Durable and long-lasting.</p>
        </div>
        <div className="mb-4 md:mb-0">
          <h3 className="text-2xl font-bold">Fast Turnaround</h3>
          <p className="text-neutral-300">Quick production and delivery.</p>
        </div>
        <div className="mb-4 md:mb-0">
          <h3 className="text-2xl font-bold">Expert Support</h3>
          <p className="text-neutral-300">Dedicated team to assist you.</p>
        </div>
      </div>
    </section>
  );
}

