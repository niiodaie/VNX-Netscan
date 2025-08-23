import React from "react";

export default function Testimonial({ quote, author, title }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
      <p className="text-lg text-neutral-700 italic">"{quote}"</p>
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <p className="font-semibold text-neutral-900">{author}</p>
        <p className="text-sm text-neutral-600">{title}</p>
      </div>
    </div>
  );
}

