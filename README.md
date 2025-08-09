# Kids AI — Modular (Vercel)
Modules:
- modules/chat.js → text + voice (calls /api/ask → Gemini)
- modules/draw.js → drawing + on-device AI guess (MobileNet) + picture
- modules/camera.js → camera + filters
- modules/main.js → onboarding + routing + wiring
Deploy:
1) Push to GitHub.
2) Vercel → New Project → Import.
3) Settings → Env Vars → GEMINI_API_KEY.
4) Deploy.
