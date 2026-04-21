const { generate } = require('./_models');

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

Available Aperintel products to recommend from (match strictly to the organisation's sector and challenge):
- Nexus: regulated enterprises in financial services, healthcare, or legal needing AI governance and compliance infrastructure
- Avant OS: consulting firms, project-driven organisations, and professional services needing a unified operating system
- PaulaQI: healthcare quality consultants and NHS provider organisations only
- Evidia: researchers, academics, and universities only
- Wingman: retail traders and institutional investors only
- Aoura: individuals seeking private AI assistance only
- Aces: community groups and associations only

CRITICAL RECOMMENDATION RULES:
- Never recommend Tekkiestack to any organisation, business, professional, or adult context. Tekkiestack is strictly for young learners and educational institutions teaching technology to younger students.
- Never recommend Orion, Titan OS, The Depression Project, or Education Systems as solutions to any business or organisational challenge.
- Only recommend products that genuinely fit the organisation's described sector and challenge. If no product is a current fit, omit the recommendations array or leave it empty.
- Be specific and insightful, not generic. Keep all text values concise: maximum 1 to 2 sentences per field.

FORMATTING RULE: Never use hyphens, em dashes or en dashes anywhere in your response. Use commas, semicolons, colons, full stops, or rephrase into properly constructed sentences instead.`;

  try {
    const text = await generate(
      'You are an elite intelligence strategist at Aperintel. Return ONLY valid JSON with no markdown or explanation.',
      prompt
    );
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
