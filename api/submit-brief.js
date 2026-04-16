const { kv } = require('@vercel/kv');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).end();
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { solution, contact, originalDescription, context } = req.body;

  if (!solution || !contact || !contact.name || !contact.email) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Generate reference number: APR-YYYYMMDD-XXXX
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  const reference = `APR-${datePart}-${randPart}`;

  const submission = {
    reference,
    submittedAt: now.toISOString(),
    status: 'new',
    contact: {
      name: contact.name,
      email: contact.email,
      organisation: contact.organisation || '',
      notes: contact.notes || ''
    },
    originalDescription,
    context: context || {},
    solution
  };

  try {
    // Store in Vercel KV: push to a list keyed by 'project-briefs'
    await kv.lpush('project-briefs', JSON.stringify(submission));

    // Also store individually by reference for quick lookup
    await kv.set(`brief:${reference}`, JSON.stringify(submission));

    res.json({ success: true, reference });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ error: 'Failed to submit brief. Please try again.' });
  }
};
