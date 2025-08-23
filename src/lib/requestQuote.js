// Helper to send a quote request to Supabase Edge Function
export async function requestQuote(payload) {
  try {
    const res = await fetch("/functions/v1/requestQuote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: text || `HTTP ${res.status}` };
    }
    const data = await res.json().catch(() => ({}));
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e?.message || "Network error" };
  }
}

