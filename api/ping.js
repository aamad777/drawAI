// api/ping.js
module.exports = async (req, res) => {
  return res.status(200).json({
    ok: true,
    runtime: 'node',
    envHasKey: Boolean(process.env.GEMINI_API_KEY || false)
  });
};
