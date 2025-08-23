// src/components/RequireAuth.jsx
import React from "react";
import { useAuth } from "../hooks/useAuth";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6 text-sm text-neutral-600">Loading…</div>;
  if (!user) {
    return (
      <div className="p-6 max-w-lg mx-auto text-center">
        <h2 className="text-xl font-semibold mb-2">Please sign in</h2>
        <p className="text-sm text-neutral-600">You need an account to view this page and save quotes.</p>
      </div>
    );
  }
  return children;
}
