import React from "react";

export default function ProductCard({ product, nav }) {
  return (
    <div className="group rounded-2xl border border-neutral-200 bg-white p-5 hover:shadow-md transition-shadow">
      <div className="aspect-video rounded-xl bg-neutral-100 grid place-items-center text-neutral-400 text-sm">
        <img src={`/images/products/${product.id}.png`} alt={product.name} className="object-cover w-full h-full rounded-xl" />
      </div>
      <h3 className="mt-3 font-semibold text-lg">{product.name}</h3>
      <p className="text-neutral-600 text-sm">From ${product.price.toFixed(2)} • Min {product.min}</p>
      <div className="mt-3 flex gap-3">
        <button onClick={() => nav({ name: "product", id: product.id })} className="text-indigo-600 text-sm group-hover:underline">View</button>
        <button onClick={() => nav("quote")} className="text-sm text-neutral-600 hover:text-neutral-800">Quick quote</button>
      </div>
    </div>
  );
}

