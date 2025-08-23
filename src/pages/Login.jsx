// src/pages/Login.jsx
import React from "react";
import AuthButtons from "../components/AuthButtons";

export default function Login() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-3">Sign in to VisnecPrint</h1>
      <p className="text-neutral-600 mb-6">Use Google or request a magic link by email.</p>
      <AuthButtons />
    </div>
  );
}
