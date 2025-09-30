import fetch from 'node-fetch';

const FLASK_BACKEND = 'http://us1.bot-hosting.net:20917/api';

export default async function handler(req, res) {
  try {
    // Remove /api/proxy from URL
    const path = req.url.replace(/^\/api\/proxy/, '') || '/';
    const targetUrl = `${FLASK_BACKEND}${path}`;

    // Forward method, headers, and body
    const options = {
      method: req.method,
      headers: { ...req.headers },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : await req.text()
    };

    const response = await fetch(targetUrl, options);

    // Forward headers
    response.headers.forEach((value, key) => res.setHeader(key, value));

    // Forward status and body
    const data = await response.text();
    res.status(response.status).send(data);

  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy failed', details: err.toString() });
  }
}
