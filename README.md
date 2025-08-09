# Kids AI — Modular (Fixed3)
- CJS serverless functions in `/api` (ask, ping), runtime pinned to Node 18.
- Frontend modules: `helpers.js`, `main.js`, `chat.js`, `draw.js`, `camera.js`.

Deploy (Vercel)
1) Push files to GitHub → Import project in Vercel.
2) Add env var `GEMINI_API_KEY`.
3) Deploy. Check `/api/ping` returns `{ ok: true, envHasKey: true }`.
