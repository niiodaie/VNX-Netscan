import React from "react";

export default function CategoryCard({ category, nav }) {
  return (
    <div className="group rounded-2xl border border-neutral-200 bg-white p-5 hover:shadow-md transition-shadow">
      <div className="aspect-video rounded-xl bg-neutral-100 grid place-items-center text-neutral-400 text-sm">
        <img src={`/images/categories/${category.id}_1.png`} alt={category.title} className="object-cover w-full h-full rounded-xl" />
      </div>
      <h3 className="mt-3 font-semibold text-lg">{category.title}</h3>
      <ul className="mt-1 text-neutral-600 text-sm list-disc list-inside">
        {category.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <div className="mt-3">
        <button onClick={() => nav("catalog")} className="text-indigo-600 text-sm group-hover:underline">View all →</button>
      </div>
    </div>
  );
}

