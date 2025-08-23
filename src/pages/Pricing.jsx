import React from "react";

export default function Pricing() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h2 className="text-2xl md:text-3xl font-bold text-center">Pricing</h2>
      <p className="text-neutral-600 mt-2 text-center max-w-xl mx-auto">Simple, transparent pricing for all your custom printing needs. No hidden fees, just great value.</p>

      <div className="mt-10 grid md:grid-cols-3 gap-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center">
          <h3 className="font-bold text-xl">Starter</h3>
          <p className="text-neutral-600 mt-2">Perfect for small businesses and personal projects.</p>
          <div className="mt-4 text-4xl font-bold text-indigo-600">$99<span className="text-lg text-neutral-500">/project</span></div>
          <ul className="mt-5 space-y-2 text-sm text-neutral-600">
            <li>50 units minimum</li>
            <li>Basic decoration methods</li>
            <li>Standard turnaround time</li>
            <li>Email support</li>
          </ul>
          <button className="mt-8 px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow">Get Started</button>
        </div>
        <div className="rounded-2xl border border-indigo-400 bg-indigo-50 p-6 text-center shadow-lg">
          <h3 className="font-bold text-xl text-indigo-800">Business</h3>
          <p className="text-indigo-700 mt-2">Ideal for growing companies and regular orders.</p>
          <div className="mt-4 text-4xl font-bold text-indigo-600">$249<span className="text-lg text-indigo-500">/project</span></div>
          <ul className="mt-5 space-y-2 text-sm text-indigo-700">
            <li>100 units minimum</li>
            <li>All decoration methods</li>
            <li>Faster turnaround time</li>
            <li>Phone + Email support</li>
            <li>Dedicated account manager</li>
          </ul>
          <button className="mt-8 px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow">Choose Plan</button>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center">
          <h3 className="font-bold text-xl">Enterprise</h3>
          <p className="text-neutral-600 mt-2">For large organizations with complex needs.</p>
          <div className="mt-4 text-4xl font-bold text-indigo-600">Custom</div>
          <ul className="mt-5 space-y-2 text-sm text-neutral-600">
            <li>Volume discounts</li>
            <li>Custom solutions</li>
            <li>Priority support</li>
            <li>API access</li>
          </ul>
          <button className="mt-8 px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow">Contact Sales</button>
        </div>
      </div>
    </section>
  );
}

