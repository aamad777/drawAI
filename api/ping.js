module.exports = async (req, res) => {
  const ok = true;
  const envHasKey = !!process.env.GEMINI_API_KEY;
  res.status(200).json({ ok, runtime: "node", envHasKey });
};