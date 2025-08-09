module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ text: 'Method not allowed' });
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return res.status(500).json({ text: 'Missing GEMINI_API_KEY' });
  try {
    const { message, name = 'friend', age = '5-8' } = req.body || {};
    if (!message || typeof message !== 'string') return res.status(400).json({ text: 'No message' });
    const system = `You are a friendly, age-aware Kids AI.
- Be positive, simple, and encouraging.
- Keep answers short (1–3 sentences) unless asked for more.
- Avoid unsafe topics; redirect kindly to kid-friendly subjects.
- For ages 2–4: use very simple words. For 5–8: a bit more detailed.`;
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + GEMINI_API_KEY;
    const body = { contents: [{ role: 'user', parts: [{ text: `${system}\n\nChild name: ${name}; Age: ${age}\n\nChild said: ${message}` }]}], generationConfig: { temperature: 0.8, maxOutputTokens: 200 } };
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) return res.status(500).json({ text: 'Gemini API error' });
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure—try again?";
    return res.status(200).json({ text });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ text: 'Server error' });
  }
};