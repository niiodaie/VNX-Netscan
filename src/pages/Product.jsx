import React, { useState, useMemo } from "react";
import Field from "../components/Field";
import SocialLinks from "../components/SocialLinks";

export default function Product({ product, nav, cart, setCart, logo, setLogo }) {
  const [qty, setQty] = useState(product.min);
  const [method, setMethod] = useState("Screen Print");
  const [placement, setPlacement] = useState("Front");
  const [color, setColor] = useState("Black");

  // Calculate subtotal based on quantity and base price
  const subtotal = useMemo(() => {
    const basePrice = product.price;
    // Simple pricing tiers - more quantity = lower per-unit price
    let unitPrice = basePrice;
    if (qty >= 100) unitPrice = basePrice * 0.9;
    if (qty >= 250) unitPrice = basePrice * 0.8;
    if (qty >= 500) unitPrice = basePrice * 0.7;
    
    return qty * unitPrice;
  }, [qty, product.price]);

  function addToQuote() {
    setCart([...cart, { product, qty, method, placement, color, subtotal }]);
    nav("quote");
  }

  function onLogo(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result);
    reader.readAsDataURL(f);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Polished Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">{product.name}</h1>
        <p className="text-lg text-neutral-600 mt-3 max-w-2xl mx-auto">
          {product.desc || "Customize this product with your logo and branding"}
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-neutral-500">
          <span>Starting at ${product.price.toFixed(2)}</span>
          <span>•</span>
          <span>Minimum {product.min} units</span>
          <span>•</span>
          <span>3-7 day production</span>
        </div>
      </div>

      <section className="grid md:grid-cols-2 gap-12">
        {/* Product Preview */}
        <div>
          <div className="aspect-square rounded-2xl bg-neutral-50 grid place-items-center border border-neutral-200 overflow-hidden">
            {logo ? (
              <div className="text-center p-8">
                <div className="text-neutral-500 text-sm mb-4 font-medium">Logo Preview</div>
                <div className="relative">
                  <img 
                    src={`/images/products/${product.id}.png`} 
                    alt={product.name} 
                    className="object-contain w-full h-64 opacity-90" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={logo} 
                      alt="logo preview" 
                      className="max-h-16 max-w-24 object-contain drop-shadow-sm" 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <img 
                src={`/images/products/${product.id}.png`} 
                alt={product.name} 
                className="object-contain w-full h-full p-8" 
              />
            )}
          </div>
          
          {/* Logo Upload */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Upload Your Logo (Optional)
            </label>
            <input 
              type="file" 
              onChange={onLogo} 
              accept="image/*"
              className="block w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
            />
            <p className="mt-2 text-xs text-neutral-500">
              Accepted formats: PNG, JPG, SVG. Max size: 5MB
            </p>
          </div>
        </div>

        {/* Product Configurator */}
        <div>
          <div className="bg-white border border-neutral-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Configure Your Order</h2>
            
            <div className="grid gap-4">
              <Field label="Decoration Method">
                <select 
                  value={method} 
                  onChange={(e) => setMethod(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {["Screen Print", "DTG", "Embroidery", "Laser Engrave", "Pad Print"].map(x => 
                    <option key={x} value={x}>{x}</option>
                  )}
                </select>
              </Field>

              <Field label="Logo Placement">
                <select 
                  value={placement} 
                  onChange={(e) => setPlacement(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {["Front", "Back", "Left Chest", "Right Chest", "Wrap"].map(x => 
                    <option key={x} value={x}>{x}</option>
                  )}
                </select>
              </Field>

              <Field label="Product Color">
                <select 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {["Black", "White", "Navy", "Gray", "Red", "Royal Blue", "Forest Green"].map(x => 
                    <option key={x} value={x}>{x}</option>
                  )}
                </select>
              </Field>

              <Field label="Quantity">
                <input 
                  type="number" 
                  min={product.min} 
                  value={qty} 
                  onChange={(e) => setQty(Math.max(product.min, Number(e.target.value)))} 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                />
              </Field>
            </div>

            {/* Pricing Summary */}
            <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-neutral-600">Unit Price:</span>
                <span className="text-sm font-medium">${(subtotal / qty).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-neutral-600">Quantity:</span>
                <span className="text-sm font-medium">{qty} units</span>
              </div>
              <div className="border-t border-neutral-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="text-xl font-bold text-indigo-600">${subtotal.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Final pricing may vary based on artwork complexity and setup fees
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={addToQuote} 
                className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Add to Quote Request
              </button>
              <button 
                onClick={() => nav("catalog")} 
                className="px-6 py-3 rounded-xl border border-neutral-300 bg-white text-neutral-700 font-medium hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 transition-colors"
              >
                Back to Catalog
              </button>
            </div>

            {/* Timeline Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Production Timeline</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Proof delivery: Within 24 hours</li>
                <li>• Production time: 3-7 business days</li>
                <li>• White-label shipping available</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <div className="border-t border-neutral-200 pt-12 mt-16">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Connect with us</h3>
          <div className="flex justify-center">
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  );
}

