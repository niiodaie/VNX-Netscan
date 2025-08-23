import React, { useState } from "react";
import Field from "../components/Field";
import { requestQuote } from "../lib/requestQuote";

export default function Quote({ cart, setCart, nav, logo, setLogo }) {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState({ name:"", email:"", company:"", date:"", address:"" });

  const subtotal = cart.reduce((s,i)=> s + i.product.price * i.qty, 0);

  function removeItem(idx){
    setCart(cart.filter((_,i)=> i!==idx));
  }

  async function submit(){
    if (!info?.name || !info?.email || cart.length === 0) {
      alert("Please provide your name, email, and at least one cart item.");
      return;
    }
    const items = cart.map(i => ({
      product_id: i.product?.id,
      qty: i.qty,
      method: i.method || "DTG",
      placement: i.placement,
      color: i.color,
    }));
    const res = await requestQuote({ ...info, items, logoDataUrl: logo || null });
    if (res.ok) setStep(4);
    else alert("Could not send request. Please try again.");
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h2 className="text-2xl md:text-3xl font-bold">Quote Builder</h2>
      <p className="text-neutral-600 mt-1">Upload a logo, choose products, and request a free mockup + pricing.</p>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className={`rounded-2xl border p-5 ${step>=1?"border-indigo-300 bg-indigo-50":"border-neutral-200 bg-white"}`}>
          <div className="text-sm font-semibold mb-2">1. Products</div>
          {cart.length===0 ? <div className="text-sm text-neutral-500">No items yet. Add from catalog.</div> : (
            <ul className="space-y-3 text-sm">
              {cart.map((i,idx)=> (
                <li key={idx} className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{i.product.name}</div>
                    <div className="text-neutral-600">{i.qty} × ${i.product.price.toFixed(2)} • {i.method}, {i.placement}, {i.color}</div>
                  </div>
                  <button onClick={()=>removeItem(idx)} className="text-neutral-500 hover:text-neutral-800">Remove</button>
                </li>
              ))}
            </ul>
          )}
          <button onClick={()=>nav("catalog")} className="mt-4 text-indigo-600 text-sm hover:underline">Add more products →</button>
        </div>
        <div className={`rounded-2xl border p-5 ${step>=2?"border-indigo-300 bg-indigo-50":"border-neutral-200 bg-white"}`}>
          <div className="text-sm font-semibold mb-2">2. Brand assets</div>
          <label className="block text-sm">Upload logo</label>
          <input type="file" onChange={(e)=>{
            const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>setLogo(r.result); r.readAsDataURL(f);
          }} className="mt-1 text-sm"/>
          {logo && (
            <div className="mt-3 text-center">
              <div className="text-neutral-500 text-sm mb-2">Preview</div>
              <img src={logo} alt="logo preview" className="mx-auto max-h-32 object-contain"/>
            </div>
          )}
        </div>
        <div className={`rounded-2xl border p-5 ${step>=3?"border-indigo-300 bg-indigo-50":"border-neutral-200 bg-white"}`}>
          <div className="text-sm font-semibold mb-2">3. Your details</div>
          <Field label="Name">
            <input type="text" value={info.name} onChange={(e)=>setInfo({...info,name:e.target.value})} className="w-full px-3 py-2 rounded-xl border border-neutral-300"/>
          </Field>
          <Field label="Email">
            <input type="email" value={info.email} onChange={(e)=>setInfo({...info,email:e.target.value})} className="w-full px-3 py-2 rounded-xl border border-neutral-300"/>
          </Field>
          <Field label="Company (optional)">
            <input type="text" value={info.company} onChange={(e)=>setInfo({...info,company:e.target.value})} className="w-full px-3 py-2 rounded-xl border border-neutral-300"/>
          </Field>
          <Field label="In-hands date (optional)">
            <input type="date" value={info.date} onChange={(e)=>setInfo({...info,date:e.target.value})} className="w-full px-3 py-2 rounded-xl border border-neutral-300"/>
          </Field>
          <Field label="Shipping address (optional)">
            <textarea value={info.address} onChange={(e)=>setInfo({...info,address:e.target.value})} className="w-full px-3 py-2 rounded-xl border border-neutral-300"></textarea>
          </Field>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-lg font-semibold">Subtotal: ${subtotal.toFixed(2)}</div>
        <button onClick={submit} className="px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow">Submit Quote Request</button>
      </div>

      {step===4 && (
        <div className="mt-8 p-6 rounded-2xl bg-green-50 border border-green-200 text-green-800">
          <h3 className="font-bold text-lg">Quote Request Submitted!</h3>
          <p className="mt-2 text-sm">Thanks, {info.name}! We've received your request and will get back to you at {info.email} within 24 hours with a free mockup and pricing.</p>
          <button onClick={()=>{
            nav("home"); setCart([]); setLogo(null); setStep(1); setInfo({ name:"", email:"", company:"", date:"", address:"" });
          }} className="mt-4 text-sm text-green-700 hover:underline">Back to Home</button>
        </div>
      )}
    </section>
  );
}

