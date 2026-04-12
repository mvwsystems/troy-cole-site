const https = require('https');

exports.handler = async function () {
  const RSS_URL = 'https://troycole.substack.com/feed';

  return new Promise((resolve) => {
    https.get(RSS_URL, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
          },
          body: data,
        });
      });
    }).on('error', (err) => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      });
    });
  });
};
