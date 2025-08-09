# Kids AI — Modular (Gemini + Voice + AI Draw + Camera)

## Files
- `modules/helpers.js` — shared state + stepper + routing helpers
- `modules/main.js` — onboarding + wiring
- `modules/chat.js` — text & voice chat (calls `/api/ask` → Gemini)
- `modules/draw.js` — drawing pad + MobileNet guess + picture reveal
- `modules/camera.js` — camera + filters + save
- `api/ask.js` — Vercel serverless using Gemini 1.5 Flash (needs `GEMINI_API_KEY`)
- `public/*.svg` — simple images for draw reveal
- `index.html`, `style.css`, `vercel.json`

## Deploy (Vercel)
1) Push all files to a new GitHub repo.
2) Vercel → New Project → Import.
3) Settings → Environment Variables:
   - `GEMINI_API_KEY` = your key from Google AI Studio.
4) Deploy → open the URL.
