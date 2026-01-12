/**
 * Minimal Mock GraphQL Server
 * Run with: node mock-graphql-server.js
 */

const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/graphql' && req.method === 'POST') {
    const authHeader = req.headers['authorization'];
    if (authHeader !== 'Bearer demo-secret-token') {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ errors: [{ message: 'Unauthorized' }] }));
      return;
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log(`[GraphQL] Request at ${new Date().toISOString()}`);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        data: {
          sitePreferences: {
            json: {
              brandName: 'Demo Brand',
              theme: { primaryColor: '#E31837' },
              lastUpdated: new Date().toISOString(),
            },
          },
        },
      }));
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(4000, () => {
  console.log('Mock GraphQL server running at http://localhost:4000/graphql');
});
