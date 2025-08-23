// Minimal Supabase Edge Function (Deno) — returns success JSON
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req: Request) => {
  try {
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
    const body = await req.json().catch(() => ({}));
    const { name, email, items } = body || {};
    if (!name || !email || !Array.isArray(items) || items.length === 0) {
      return Response.json({ ok: false, reason: "invalid-request" }, { status: 400 });
    }
    return Response.json({ ok: true, received: { name, email, count: items.length } }, { status: 200 });
  } catch (e) {
    return Response.json({ ok: false, reason: "server-error" }, { status: 500 });
  }
});
