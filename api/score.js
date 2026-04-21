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

  const { answers } = req.body;
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Missing answers' });
  }


  const prompt = `You are an intelligence maturity analyst at Aperintel. Assess this organisation's intelligence maturity based on their answers.

Assessment Answers:
${answers.map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`).join('\n\n')}

Score their intelligence maturity from 0-100 based on:
- How structured their decision-making is (25pts)
- How well they leverage data and knowledge (25pts)
- How automated their key workflows are (25pts)
- How forward-looking vs reactive they are (25pts)

Return ONLY valid JSON (no markdown) with this exact structure:
{
  "score": <integer 0-100>,
  "level": "<one of: Fragmented, Emerging, Structured, Advanced, Intelligent>",
  "headline": "<8-12 word punchy statement describing their current state>",
  "summary": "2-3 sentences describing their intelligence situation with precision and honesty",
  "strengths": [
    "Specific strength observed from their answers",
    "Specific strength observed from their answers"
  ],
  "gaps": [
    "Specific intelligence gap based on their answers",
    "Specific intelligence gap based on their answers",
    "Specific intelligence gap based on their answers"
  ],
  "topProduct": "<most relevant Aperintel product for them — choose from: Nexus, Avant OS, PaulaQI, Evidia, Wingman, Aoura, Aces>",
  "productReason": "One sentence on why this product addresses their biggest gap",
  "nextStep": "One concrete, actionable recommendation they can act on immediately"
}

CRITICAL PRODUCT RULES:
- Nexus: for regulated enterprises (financial services, healthcare, legal) needing AI governance and compliance infrastructure
- Avant OS: for consulting firms, project-driven organisations, and professional services needing a unified operating system
- PaulaQI: for healthcare quality consultants and NHS provider organisations only
- Evidia: for researchers, academics, and universities only
- Wingman: for retail traders and institutional investors only
- Aoura: for individuals seeking private AI assistance only
- Aces: for community groups and associations only
- Never recommend Tekkiestack, Orion, Titan OS, The Depression Project, or Education Systems as a topProduct. These are not appropriate for any organisation completing this assessment.

Intelligence levels:
- 0-20: Fragmented (reactive, disconnected, no intelligence structure)
- 21-40: Emerging (some data awareness, inconsistent structure)
- 41-60: Structured (organised but not yet intelligent)
- 61-80: Advanced (intelligent processes, room for deeper systems)
- 81-100: Intelligent (AI-native, structured, compounding)

Be honest and specific. A score that is too high means nothing. The value is in the precision of the gaps and the clarity of the path forward.

FORMATTING RULE: Never use hyphens, em dashes or en dashes anywhere in the JSON string values. Use commas, semicolons, colons, full stops, or rephrase into properly constructed sentences instead.`;

  try {
    const text = await generate(
      'You are an intelligence maturity analyst at Aperintel. Return ONLY valid JSON with no markdown or explanation.',
      prompt
    );
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonStr = text.slice(jsonStart, jsonEnd);
    const result = JSON.parse(jsonStr);

    res.json(result);
  } catch (err) {
    console.error('Score error:', err);
    res.status(500).json({ error: 'Failed to generate score' });
  }
};
