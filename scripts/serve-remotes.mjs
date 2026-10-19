#!/usr/bin/env node
import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Parse CLI flags for excluding ports/remotes
const args = process.argv.slice(2);
const excludeArgs = [];
for (const arg of args) {
  if (arg.startsWith('--exclude=')) {
    excludeArgs.push(...arg.replace('--exclude=', '').split(',').map(s => s.trim().toLowerCase()));
  } else if (arg.startsWith('--skip=')) {
    excludeArgs.push(...arg.replace('--skip=', '').split(',').map(s => s.trim().toLowerCase()));
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.map': 'application/json',
};

const REMOTE_CONFIGS = [
  {
    name: 'vite-remoteapp-1',
    aliases: ['v-react', 'react', 'vite-react', '5251'],
    port: 5251,
    distDir: path.join(ROOT_DIR, 'vite-remoteapp-1', 'dist'),
  },
  {
    name: 'vite-remoteapp-2',
    aliases: ['v-vue', 'vue', 'vite-vue', '5252'],
    port: 5252,
    distDir: path.join(ROOT_DIR, 'vite-remoteapp-2', 'dist'),
  },
  {
    name: 'vite-remoteapp-3',
    aliases: ['v-svelte', 'svelte', 'vite-svelte', '5253'],
    port: 5253,
    distDir: path.join(ROOT_DIR, 'vite-remoteapp-3', 'dist'),
  },
  {
    name: 'vite-remoteapp-4',
    aliases: ['v-solid', 'solid', 'solidjs', 'vite-solid', '5254'],
    port: 5254,
    distDir: path.join(ROOT_DIR, 'vite-remoteapp-4', 'dist'),
  },
  {
    name: 'webpack-remoteapp-1',
    aliases: ['w-react', 'webpack-react', '5161'],
    port: 5161,
    distDir: path.join(ROOT_DIR, 'webpack-remoteapp-1', 'dist'),
  },
  {
    name: 'webpack-remoteapp-2',
    aliases: ['w-vue', 'webpack-vue', '5162'],
    port: 5162,
    distDir: path.join(ROOT_DIR, 'webpack-remoteapp-2', 'dist'),
  },
  {
    name: 'angular-remoteapp',
    aliases: ['angular', 'ng', '4201'],
    port: 4201,
    distDir: path.join(ROOT_DIR, 'angular-remoteapp', 'dist', 'angular-remoteapp', 'browser'),
  },
  {
    name: 'wc-lit-app',
    aliases: ['wc-lit', 'lit', '5302'],
    port: 5302,
    distDir: path.join(ROOT_DIR, 'wc-lit-app', 'dist'),
  },
  {
    name: 'wc-vue-app',
    aliases: ['wc-vue', 'vue-wc', '5303'],
    port: 5303,
    distDir: path.join(ROOT_DIR, 'wc-vue-app', 'dist'),
  },
  {
    name: 'iframe-vite-app',
    aliases: ['iframe-vite', 'iframe-react', '5300'],
    port: 5300,
    distDir: path.join(ROOT_DIR, 'iframe-vite-app', 'dist'),
  },
  {
    name: 'iframe-nextjs-app',
    aliases: ['iframe-nextjs', 'iframe-next', 'nextjs', '5301'],
    port: 5301,
    distDir: path.join(ROOT_DIR, 'iframe-nextjs-app', 'out'),
  },
];

// Check HTTPS certificates
const certPath = path.join(ROOT_DIR, 'certs', 'localhost.pem');
const keyPath = path.join(ROOT_DIR, 'certs', 'localhost-key.pem');
const hasCerts = fs.existsSync(certPath) && fs.existsSync(keyPath);
const sslOptions = hasCerts
  ? {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath),
    }
  : null;

function isExcluded(config) {
  if (excludeArgs.includes(String(config.port))) return true;
  if (excludeArgs.includes(config.name.toLowerCase())) return true;
  return config.aliases.some(alias => excludeArgs.includes(alias.toLowerCase()));
}

function createStaticHandler(distDir, appName, port) {
  return (req, res) => {
    // Universal CORS and Framing headers for microfrontends
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Timing-Allow-Origin', '*');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://localhost:5150 https://localhost:5173 *");

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
      return;
    }

    const parsedUrl = new URL(req.url, `https://localhost:${port}`);
    let decodedPath = decodeURIComponent(parsedUrl.pathname);

    // Default to index.html if root requested
    if (decodedPath === '/' || decodedPath === '') {
      decodedPath = '/index.html';
    }

    const filePath = path.normalize(path.join(distDir, decodedPath));

    // Prevent directory traversal
    if (!filePath.startsWith(distDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        // Fallback for SPA routing if index.html exists
        const indexPath = path.join(distDir, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
          fs.createReadStream(indexPath).pipe(res);
          return;
        }

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`404 Not Found: ${decodedPath} in ${appName}`);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Cache-Control': 'no-cache', // Fast dev cycle
      });

      if (req.method === 'HEAD') {
        res.end();
        return;
      }

      fs.createReadStream(filePath).pipe(res);
    });
  };
}

const activeServers = [];

console.log('');
console.log('⚡ [Watermelon Unified Static Server] Initializing lightweight remote server...');
console.log(`🔒 HTTPS: ${hasCerts ? 'Enabled (certs/localhost.pem)' : 'Disabled (HTTP fallback)'}`);
console.log('──────────────────────────────────────────────────────────────────────────────');

let servedCount = 0;

for (const config of REMOTE_CONFIGS) {
  if (isExcluded(config)) {
    console.log(`  ⏭️  [Port ${config.port}] ${config.name} excluded (will run live in dev mode)`);
    continue;
  }

  if (!fs.existsSync(config.distDir)) {
    console.warn(`  ⚠️  [Port ${config.port}] Missing dist directory: ${config.distDir}`);
    console.warn(`      Run "npm run build:all" once to generate production bundles for all remotes.`);
  }

  const handler = createStaticHandler(config.distDir, config.name, config.port);
  const server = sslOptions
    ? https.createServer(sslOptions, handler)
    : http.createServer(handler);

  server.on('error', (err) => {
    console.error(`  ❌ [Port ${config.port}] Server error (${config.name}):`, err.message);
  });

  server.listen(config.port, () => {
    console.log(`  ✓  [Port ${config.port}] Serving ${config.name} (${config.distDir.replace(ROOT_DIR + '/', '')})`);
  });

  activeServers.push(server);
  servedCount++;
}

console.log('──────────────────────────────────────────────────────────────────────────────');
const mem = process.memoryUsage();
console.log(`🚀 Serving ${servedCount} remote(s) in 1 Node process! RAM: ~${Math.round(mem.rss / 1024 / 1024)} MB`);
console.log('   Press Ctrl+C to stop.\n');

// Clean graceful shutdown
function shutdown() {
  console.log('\n🛑 Shutting down unified static server...');
  for (const s of activeServers) {
    try {
      s.close();
    } catch {}
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
