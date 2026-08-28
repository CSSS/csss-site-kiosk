import type { KioskVersion } from '@csss-kiosk/shared';
import dotenv from 'dotenv';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { readFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

function getSecret(): string {
  const secret = process.env.KIOSK_API_SECRET;
  if (!secret) {
    throw new Error('`KIOSK_API_SECRET` not set in .env.');
  }
  return secret;
}

function main(): void {
  const entrypointDirectory = dirname(fileURLToPath(import.meta.url));
  const serverDirectory =
    basename(entrypointDirectory) === 'dist' ? dirname(entrypointDirectory) : entrypointDirectory;
  dotenv.config({ path: join(serverDirectory, '.env') });

  const PORT = Number(process.env.SERVER_PORT ?? 8080);
  const PROXY_TARGET = process.env.PROXY_TARGET;

  // The folder our frontend is served from.
  const FRONTEND_PATH = join(
    serverDirectory,
    '..',
    'frontend',
    'dist',
    'csss-site-kiosk',
    'browser'
  );
  const VERSION_PATH = join(serverDirectory, '..', 'VERSION');

  const app = express();

  if (!PROXY_TARGET) {
    console.error('Set `PROXY_TARGET` as an environment variable.');
    process.exit(1);
  }

  // This is the secret that will be used to communicate with the web server.
  let cachedSecret: string;
  try {
    cachedSecret = getSecret();
    console.log('Secret successfully loaded.');
  } catch (err) {
    console.error('Failed to load secret:', err);
    process.exit(1);
  }

  app.get('/health', async (_, res) => {
    try {
      const version: KioskVersion = (await readFile(VERSION_PATH, 'utf8')).trim();
      res.set('Cache-Control', 'no-store').type('text/plain').send(version);
    } catch (err) {
      console.error('Failed to read version:', err);
      res
        .status(503)
        .set('Cache-Control', 'no-store')
        .type('text/plain')
        .send('Version unavailable.');
    }
  });

  // Proxy backend requests while preserving their route prefixes upstream.
  app.use(
    createProxyMiddleware({
      target: PROXY_TARGET,
      changeOrigin: true,
      pathFilter: ['/kiosk', '/api'],
      on: {
        proxyReq: proxyReq => {
          proxyReq.setHeader('Authorization', `Bearer ${cachedSecret}`);
        },
        error: (err, _, res) => {
          console.error('Proxy error:', err.message);
          if ('writeHead' in res) {
            res.writeHead(502, { 'Content-Type': 'application/json' });
          }
          res.end(JSON.stringify({ error: 'Proxy failed to reach server.' }));
        }
      }
    })
  );

  // Serve the built frontend files
  app.use(express.static(FRONTEND_PATH));

  // Add SPA fallback
  app.get('/{*splat}', (_, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(join(FRONTEND_PATH, 'index.html'));
  });

  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Kiosk server running on http://localhost:${PORT}`);
    console.log(`Proxying API -> ${PROXY_TARGET}`);
  });

  process.on('uncaughtException', err => {
    console.error('Uncaught exception:', err);
  });

  process.on('unhandledRejection', err => {
    console.error('Uncaught exception:', err);
  });
}

main();
