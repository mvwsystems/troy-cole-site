const https = require('https');

const KIT_API_KEY = process.env.KIT_API_KEY || 'r_N6cRcFv0R3rZnkU5gIIw';

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { formId, firstName, email, tag } = body;

  if (!formId || !email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  const payload = JSON.stringify({
    api_key: KIT_API_KEY,
    first_name: firstName || '',
    email,
    tags: tag ? [tag] : [],
  });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: 'api.convertkit.com',
        path: `/v3/forms/${formId}/subscribe`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: data,
          });
        });
      }
    );
    req.on('error', (err) => {
      resolve({ statusCode: 500, body: JSON.stringify({ error: err.message }) });
    });
    req.write(payload);
    req.end();
  });
};
