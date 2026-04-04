const Anthropic = require('@anthropic-ai/sdk');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).end();

  res.setHeader('Access-Control-Allow-Origin', '*');

  const { sector, challenge, scale } = req.body;
  if (!sector || !challenge || !scale) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `You are an elite intelligence strategist at Aperintel. A visitor has described their organisation. Generate a precise, structured Intelligence Brief.

Organisation Details:
- Sector: ${sector}
- Scale: ${scale}
- Primary Challenge: ${challenge}

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "summary": "2-3 sentence executive summary of their situation and the intelligence opportunity",
  "gaps": [
    {"title": "Gap Name", "description": "One sentence explaining this intelligence gap"},
    {"title": "Gap Name", "description": "One sentence explaining this intelligence gap"},
    {"title": "Gap Name", "description": "One sentence explaining this intelligence gap"}
  ],
  "quickWins": [
    "Specific, actionable insight for immediate value",
    "Specific, actionable insight for immediate value",
    "Specific, actionable insight for immediate value"
  ],
  "recommendations": [
    {"product": "Product Name from Aperintel ecosystem", "reason": "One precise sentence on why this fits"},
    {"product": "Product Name from Aperintel ecosystem", "reason": "One precise sentence on why this fits"}
  ],
  "pathway": "2-3 sentences describing the recommended implementation approach and what changes first"
}

Available Aperintel products to recommend from: Enterprise Platform, Avant, Tipintel, Wingman, Aoura, Aces, Tekkiestack, Orion, Titan OS, The Depression Project, Education Systems.
Only recommend products that genuinely fit their described challenge. Be specific and insightful, not generic. Keep all text values concise: maximum 1 to 2 sentences per field.

FORMATTING RULE: Never use hyphens, em dashes or en dashes anywhere in your response. Use commas, semicolons, colons, full stops, or rephrase into properly constructed sentences instead.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = message.content[0].text.trim();
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonStr = text.slice(jsonStart, jsonEnd);
    const brief = JSON.parse(jsonStr);

    res.json(brief);
  } catch (err) {
    console.error('Brief error:', err);
    res.status(500).json({ error: 'Failed to generate brief' });
  }
};
