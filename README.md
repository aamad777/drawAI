# Kids AI — Modular (Gemini + Voice + Draw + Camera)

- `modules/main.js` → onboarding + routing
- `modules/helpers.js` → shared state + utils
- `modules/chat.js` → text+voice chat (calls `/api/ask` → Gemini)
- `modules/draw.js` → drawing pad + on-device AI guess (MobileNet) + picture reveal
- `modules/camera.js` → camera + filters + download
- `api/ask.js` → Vercel serverless, needs `GEMINI_API_KEY`
- `public/*.svg` → simple pictures for the draw reveal

## Deploy on Vercel
1) Push files to a new GitHub repo.
2) Vercel → New Project → Import.
3) Settings → Environment Variables:
   - `GEMINI_API_KEY` = your Google AI Studio key
4) Deploy. Test the site.
