import React from "react";
import AuthButtons from "./AuthButtons";

export default function AuthCta() {
  return (
    <div className="mt-6 w-full max-w-xl rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur px-4 py-4 shadow-sm">
      <AuthButtons />
      <p className="mt-2 text-xs text-neutral-500">No password needed. We'll send you a secure sign-in link.</p>
    </div>
  );
}
