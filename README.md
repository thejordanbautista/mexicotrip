# Jordan & Alejandra CDMX Trip App

Single-use phone-first trip app for July 23-26, 2026.

## Local

```bash
npm install
cp .env.example .env
npm run build
npm run sync
```

Open `http://localhost:5174/`, or use your machine's Wi-Fi IP on both phones.

## Mapbox

Add a public Mapbox token in `.env`:

```bash
VITE_MAPBOX_TOKEN=pk.your_token
```

Without a token, the app shows the built-in fallback map so the itinerary and recommendations still work.

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_MAPBOX_TOKEN`
- KV binding for shared state: `TRIP_STATE`

The Pages Function in `functions/api/state.js` uses that KV binding for checklist and saved-place sync.
