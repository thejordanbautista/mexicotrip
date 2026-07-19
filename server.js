import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 5174;
const statePath = path.join(__dirname, "trip-state.json");

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "dist")));

async function readState() {
  try {
    return JSON.parse(await fs.readFile(statePath, "utf8"));
  } catch {
    return { updatedAt: 0, checked: {}, saved: [], notes: {} };
  }
}

app.get("/api/state", async (_req, res) => {
  res.json(await readState());
});

app.put("/api/state", async (req, res) => {
  const incoming = req.body || {};
  const state = {
    updatedAt: Date.now(),
    checked: incoming.checked || {},
    saved: Array.isArray(incoming.saved) ? incoming.saved : [],
    notes: incoming.notes || {}
  };
  await fs.writeFile(statePath, JSON.stringify(state, null, 2));
  res.json(state);
});

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`CDMX trip app running on http://localhost:${port}`);
});
