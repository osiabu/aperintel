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

  const { description, industry, scale, budget, timeline } = req.body;
  if (!description || description.trim().length < 20) {
    return res.status(400).json({ error: 'Please provide a more detailed description.' });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const contextLines = [
    industry && `Industry: ${industry}`,
    scale && `Organisation scale: ${scale}`,
    budget && `Budget range: ${budget}`,
    timeline && `Timeline: ${timeline}`
  ].filter(Boolean).join('\n');

  const prompt = `You are a senior solutions architect and product strategist at Aperintel, an intelligence infrastructure company. A prospective client has described what they need built. Your job is to assess their request and produce a structured project brief.

CLIENT REQUEST:
${description.trim()}
${contextLines ? `\nADDITIONAL CONTEXT:\n${contextLines}` : ''}

APERINTEL PRODUCT ECOSYSTEM (for reference when recommending existing solutions):
- Enterprise Platform: AI-native knowledge platform for organisations
- Avant: AI-assisted software delivery operating system
- Tipintel: Financial market intelligence and decision support
- Aoura: Private AI personal companion on zero-knowledge architecture
- Aces: Community intelligence and ecosystem management platform
- Tekkiestack: Learning platform for young people who want to code, part of Aperintel's education arm
- Wingman: AI trade analysis platform (live)
- Orion: AI orchestration layer for existing operating systems
- Titan OS: AI-native operating system (concept stage)
- The Depression Project: Mental health AI research initiative
- Education Systems: Intelligent education and training platforms, part of Aperintel's growing education arm

INSTRUCTIONS:
Assess whether this request is best met by existing Aperintel products, a custom build, or a combination. Be honest. If the client needs something bespoke that does not exist in the product lineup, say so clearly and scope it as a custom development engagement.

Return ONLY valid JSON with no markdown, no code blocks, and no explanation outside the JSON. Use this exact structure:

{
  "solutionType": "Aperintel Product Fit" or "Custom Development" or "Hybrid Solution",
  "solutionName": "Short name for this solution or engagement",
  "aperintelProducts": ["list of relevant existing Aperintel products, or empty array if none apply"],
  "solutionDescription": "Three clear paragraphs describing the recommended solution, what it achieves, and why this approach is right for the client. No hyphens.",
  "brief": [
    { "n": 1, "title": "Requirement title", "detail": "One to two sentences describing this requirement precisely." },
    { "n": 2, "title": "Requirement title", "detail": "One to two sentences describing this requirement precisely." }
  ],
  "timeline": "Realistic timeline estimate as a plain sentence",
  "deliverables": [
    "Specific deliverable 1",
    "Specific deliverable 2",
    "Specific deliverable 3"
  ],
  "nextSteps": "One paragraph describing what happens after the client approves this brief and what Aperintel will do next."
}

Include 6 to 10 brief items. Each must be specific, numbered, and actionable. Avoid vague requirements.

CRITICAL FORMATTING RULE: Do not use hyphens, em dashes or en dashes anywhere in the response values. Use commas, semicolons, colons, full stops, or rephrase into properly constructed sentences.`;

  // Stream the response so Vercel never times out waiting for a silent long-running function.
  // The client accumulates all SSE chunks, then parses the complete JSON at the end.
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  try {
    const stream = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
      stream: true
    });

    let accumulated = '';

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        accumulated += event.delta.text;
        // Send a heartbeat so the connection stays alive and the client knows we're working
        res.write(`data: ${JSON.stringify({ chunk: event.delta.text })}\n\n`);
      }
    }

    // Extract and validate JSON from the accumulated text
    const jsonStart = accumulated.indexOf('{');
    const jsonEnd = accumulated.lastIndexOf('}') + 1;

    if (jsonStart === -1 || jsonEnd <= jsonStart) {
      res.write(`data: ${JSON.stringify({ error: 'Failed to generate solution brief. Please try again.' })}\n\n`);
      return res.end();
    }

    let solution;
    try {
      solution = JSON.parse(accumulated.slice(jsonStart, jsonEnd));
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr.message);
      res.write(`data: ${JSON.stringify({ error: 'Failed to parse solution brief. Please try again.' })}\n\n`);
      return res.end();
    }

    res.write(`data: ${JSON.stringify({ done: true, solution })}\n\n`);
    res.end();

  } catch (err) {
    console.error('Solution error:', err);
    res.write(`data: ${JSON.stringify({ error: 'Failed to generate solution brief. Please try again.' })}\n\n`);
    res.end();
  }
};
