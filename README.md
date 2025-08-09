# Kids AI — Gemini + Voice + AI Draw (Zero‑install, Vercel)

Features
- Onboarding: name → age (2–4 or 5–8) → activity (Talk / Draw / Photo)
- Talk: voice in/out + Gemini answers via **/api/ask** (Vercel Serverless)
- Draw: **offline AI** (TensorFlow.js MobileNet) guesses the sketch and shows a matching **local SVG** (no keys, no quota)
- Photo: camera + fun filters

Deploy (zero install)
1) Make a Git repo from these files.
2) Vercel → Add New → Project → Import your repo.
3) Project → Settings → Environment Variables → add `GEMINI_API_KEY` (from Google AI Studio).
4) Deploy and open your *.vercel.app URL.

If your API is hosted elsewhere, edit `app.js` fetch URL (`/api/ask` → full URL).
