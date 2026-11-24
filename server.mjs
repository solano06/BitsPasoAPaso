import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

function resolveFile(reqPath) {
  let clean = decodeURIComponent(reqPath.split('?')[0]);
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  const candidates = [];
  if (clean === '/') {
    candidates.push(path.join(__dirname, 'index.html'));
  } else {
    const rel = clean.replace(/^\/+/, '');
    candidates.push(path.join(__dirname, rel));
    if (!path.extname(rel)) {
      candidates.push(path.join(__dirname, `${rel}.html`));
    }
  }

  for (const file of candidates) {
    if (!file.startsWith(__dirname)) continue;
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      return { file, status: 200 };
    }
  }

  const notFound = path.join(__dirname, '404.html');
  if (fs.existsSync(notFound)) {
    return { file: notFound, status: 404 };
  }
  return { file: null, status: 404 };
}

const server = http.createServer((req, res) => {
  const { file, status } = resolveFile(req.url || '/');
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(file);
  res.writeHead(status, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`BitsPasoAPaso preview server running at http://localhost:${PORT}`);
});
