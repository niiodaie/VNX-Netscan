import React from "react";

export default function StepProducts({ cart, removeItem, nav }) {
  return (
    <div className={`rounded-2xl border p-5 ${cart.length > 0 ? "border-indigo-300 bg-indigo-50" : "border-neutral-200 bg-white"}`}>
      <div className="text-sm font-semibold mb-2">1. Products</div>
      {cart.length === 0 ? (
        <div className="text-sm text-neutral-500">No items yet. Add from catalog.</div>
      ) : (
        <ul className="space-y-3 text-sm">
          {cart.map((i, idx) => (
            <li key={idx} className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{i.product.name}</div>
                <div className="text-neutral-600">{i.qty} × ${i.product.price.toFixed(2)} • {i.method}, {i.placement}, {i.color}</div>
              </div>
              <button onClick={() => removeItem(idx)} className="text-neutral-500 hover:text-neutral-800">Remove</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => nav("catalog")} className="mt-4 text-indigo-600 text-sm hover:underline">Add more products →</button>
    </div>
  );
}

