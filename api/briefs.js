const { kv } = require('@vercel/kv');

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'aperintel2026';

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Dashboard-Password');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  // Auth check
  const password = req.headers['x-dashboard-password'];
  if (password !== DASHBOARD_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorised.' });
  }

  // GET: fetch all briefs
  if (req.method === 'GET') {
    try {
      const rawItems = await kv.lrange('project-briefs', 0, 99);
      const briefs = rawItems.map(item => {
        try { return typeof item === 'string' ? JSON.parse(item) : item; }
        catch { return null; }
      }).filter(Boolean);
      return res.json({ briefs });
    } catch (err) {
      console.error('Fetch briefs error:', err);
      return res.status(500).json({ error: 'Failed to fetch briefs.' });
    }
  }

  // PATCH: update status
  if (req.method === 'PATCH') {
    const { reference, status } = req.body;
    const validStatuses = ['new', 'in-review', 'quoted', 'active', 'completed', 'declined'];

    if (!reference || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid reference or status.' });
    }

    try {
      const raw = await kv.get(`brief:${reference}`);
      if (!raw) return res.status(404).json({ error: 'Brief not found.' });

      const brief = typeof raw === 'string' ? JSON.parse(raw) : raw;
      brief.status = status;
      brief.statusUpdatedAt = new Date().toISOString();

      await kv.set(`brief:${reference}`, JSON.stringify(brief));

      // Rebuild the list entry
      const allRaw = await kv.lrange('project-briefs', 0, 99);
      const allBriefs = allRaw.map(item => {
        try { return typeof item === 'string' ? JSON.parse(item) : item; }
        catch { return null; }
      }).filter(Boolean);

      const idx = allBriefs.findIndex(b => b.reference === reference);
      if (idx !== -1) {
        allBriefs[idx] = brief;
        await kv.del('project-briefs');
        for (let i = allBriefs.length - 1; i >= 0; i--) {
          await kv.lpush('project-briefs', JSON.stringify(allBriefs[i]));
        }
      }

      return res.json({ success: true, brief });
    } catch (err) {
      console.error('Update status error:', err);
      return res.status(500).json({ error: 'Failed to update status.' });
    }
  }

  return res.status(405).end();
};
