import React from "react";
import Field from "../Field";

export default function StepDetails({ info, setInfo }) {
  return (
    <div className={`rounded-2xl border p-5 ${info.name && info.email ? "border-indigo-300 bg-indigo-50" : "border-neutral-200 bg-white"}`}>
      <div className="text-sm font-semibold mb-2">3. Your details</div>
      <Field label="Name">
        <input type="text" value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} required className="w-full px-3 py-2 rounded-xl border border-neutral-300" />
      </Field>
      <Field label="Email">
        <input type="email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} required className="w-full px-3 py-2 rounded-xl border border-neutral-300" />
      </Field>
      <Field label="Company (optional)">
        <input type="text" value={info.company} onChange={(e) => setInfo({ ...info, company: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-neutral-300" />
      </Field>
      <Field label="In-hands date (optional)">
        <input type="date" value={info.date} onChange={(e) => setInfo({ ...info, date: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-neutral-300" />
      </Field>
      <Field label="Shipping address (optional)">
        <textarea value={info.address} onChange={(e) => setInfo({ ...info, address: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-neutral-300"></textarea>
      </Field>
    </div>
  );
}

