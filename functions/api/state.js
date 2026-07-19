const STATE_KEY = "jordan-alejandra-cdmx-2026";

export async function onRequestGet(context) {
  const state = await readState(context.env);
  return Response.json(state);
}

export async function onRequestPut(context) {
  if (!context.env.TRIP_STATE) {
    return Response.json({ error: "Missing TRIP_STATE KV binding" }, { status: 503 });
  }

  const incoming = await context.request.json().catch(() => ({}));
  const state = {
    updatedAt: Date.now(),
    checked: incoming.checked || {},
    saved: Array.isArray(incoming.saved) ? incoming.saved : [],
    notes: incoming.notes || {}
  };

  await context.env.TRIP_STATE.put(STATE_KEY, JSON.stringify(state));
  return Response.json(state);
}

async function readState(env) {
  if (!env.TRIP_STATE) {
    return { updatedAt: 0, checked: {}, saved: [], notes: {} };
  }

  const saved = await env.TRIP_STATE.get(STATE_KEY, "json");
  return saved || { updatedAt: 0, checked: {}, saved: [], notes: {} };
}
