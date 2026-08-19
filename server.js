const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.geojson': 'application/geo+json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=UTF-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Handle Netlify Functions
  if (pathname.startsWith('/.netlify/functions/')) {
    const functionName = pathname.replace('/.netlify/functions/', '').split('/')[0];
    const functionPath = path.join(ROOT_DIR, 'netlify', 'functions', `${functionName}.js`);

    if (!fs.existsSync(functionPath)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: `Function ${functionName} not found` }));
    }

    try {
      // Collect request body
      let body = '';
      for await (const chunk of req) {
        body += chunk;
      }

      // Construct Netlify-compatible event object
      const event = {
        httpMethod: req.method,
        headers: req.headers,
        queryStringParameters: parsedUrl.query || {},
        body: body || null,
        path: pathname
      };

      // Clear module cache for live reloading during dev
      delete require.cache[require.resolve(functionPath)];
      const handlerModule = require(functionPath);

      if (typeof handlerModule.handler !== 'function') {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: `Function ${functionName} missing handler export` }));
      }

      const result = await handlerModule.handler(event, {});

      const statusCode = result.statusCode || 200;
      const headers = result.headers || { 'Content-Type': 'application/json' };
      res.writeHead(statusCode, headers);
      res.end(result.body || '');
      return;
    } catch (err) {
      console.error(`[API Error] ${pathname}:`, err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }));
    }
  }

  // Handle Static File Serving
  let filePath = path.join(ROOT_DIR, pathname === '/' ? 'index.html' : pathname);

  // Security check: ensure path stays within ROOT_DIR
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  // Check if file exists, fallback to 404.html if appropriate
  fs.stat(resolvedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      const page404 = path.join(ROOT_DIR, '404.html');
      if (fs.existsSync(page404)) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
        return fs.createReadStream(page404).pipe(res);
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    fs.createReadStream(resolvedPath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🛡️  CYBERPEHRA Local Server Running`);
  console.log(`📍 Local URL: http://localhost:${PORT}`);
  console.log(`⚡ API Endpoints: http://localhost:${PORT}/.netlify/functions/health`);
  console.log(`==================================================\n`);
});
