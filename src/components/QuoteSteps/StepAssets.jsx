import React from "react";

export default function StepAssets({ logo, setLogo }) {
  function onLogo(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result);
    reader.readAsDataURL(f);
  }

  return (
    <div className={`rounded-2xl border p-5 ${logo ? "border-indigo-300 bg-indigo-50" : "border-neutral-200 bg-white"}`}>
      <div className="text-sm font-semibold mb-2">2. Brand assets</div>
      <label className="block text-sm">Upload logo</label>
      <input type="file" onChange={onLogo} className="mt-1 text-sm" />
      {logo && (
        <div className="mt-3 text-center">
          <div className="text-neutral-500 text-sm mb-2">Preview</div>
          <img src={logo} alt="logo preview" className="mx-auto max-h-32 object-contain" />
        </div>
      )}
    </div>
  );
}

