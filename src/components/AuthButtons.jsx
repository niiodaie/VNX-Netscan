// AuthButtons.jsx (safe email flow)
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthProvider";
import NotificationToast from "./NotificationToast";

export default function AuthButtons() {
  const { supabase, user, signInWithGoogle, signOut, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!cooldown) return;
    const id = setInterval(() => setCooldown(c => Math.max(c - 1, 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type, id: Date.now() });
  };

  const sendMagicLink = useCallback(async () => {
    // extra guards
    if (!email || busy || cooldown || loading) return;
    if (!supabase?.auth?.signInWithOtp) {
      console.error("Supabase auth client missing.");
      showNotification("Auth is not initialized. Please refresh and try again.", "error");
      return;
    }

    setBusy(true);
    try {
      console.log("[MagicLink] sending to:", email);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // use callback route or home if you didn't add a callback page
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: true,
        },
      });

      if (error) {
        console.error("[MagicLink] error:", error);
        const msg = /429|rate/i.test(error.message)
          ? "Too many requests. Please wait ~60 seconds and try again."
          : error.message;
        showNotification(msg, "error");
      } else {
        showNotification("Check your inbox for the sign-in link.", "success");
        setCooldown(60);
      }
    } catch (err) {
      console.error("[MagicLink] unexpected error:", err);
      showNotification("Something went wrong sending the link. Try again in a moment.", "error");
    } finally {
      setBusy(false);
    }
  }, [email, busy, cooldown, loading, supabase]);

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-neutral-600 truncate max-w-[200px]">
          {user.email}
        </span>
        <button
          type="button"
          onClick={signOut}
          className="h-10 px-3 rounded-lg border border-neutral-300 text-sm hover:bg-neutral-50"
        >
          Sign out
        </button>
        {notification && (
          <NotificationToast
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={busy || loading}
        className="h-10 px-3 rounded-lg bg-neutral-900 text-white text-sm hover:bg-black disabled:opacity-60 whitespace-nowrap"
      >
        Continue with Google
      </button>

      <div className="flex-1 flex items-center gap-2">
        <input
          type="email"
          inputMode="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 w-full px-3 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="button"                            // ✅ never submit a form
          onClick={(e) => {                        // ✅ always pass a function
            e.preventDefault();
            void sendMagicLink();                  // ✅ prevents "not a function"
          }}
          disabled={!email || busy || cooldown || loading}
          className="h-10 px-3 rounded-lg border border-neutral-300 text-sm hover:bg-neutral-50 disabled:opacity-60 whitespace-nowrap"
        >
          {cooldown ? `Resend in ${cooldown}s` : "Email me a link"}
        </button>
      </div>

      {notification && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
