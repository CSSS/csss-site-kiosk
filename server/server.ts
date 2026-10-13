import dotenv from 'dotenv';
import express from 'express';
import { createProxyServer } from 'httpxy';
import { readFile } from 'node:fs/promises';
import { basename, dirname, join, resolve} from 'node:path';
import { fileURLToPath } from 'node:url';

function getSecret(): string {
  const secret = process.env.KIOSK_API_SECRET;
  if (!secret) {
    throw new Error('`KIOSK_API_SECRET` not set in .env.');
  }
  return secret;
}

function main(): void {
  const startedAt = Date.now();
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
      const version = (await readFile(VERSION_PATH, 'utf8')).trim();
      res.set('Cache-Control', 'no-store').type('application/json').send({
        version,
        startedAt
      });
    } catch (err) {
      console.error('Failed to read version:', err);
      res
        .status(503)
        .set('Cache-Control', 'no-store')
        .type('text/plain')
        .send('Version unavailable.');
    }
  });

    const logFiles = {
    update: process.env.KIOSK_UPDATE_LOG_PATH,
    stderr: process.env.KIOSK_STDERR_LOG_PATH
  };

  for (const [name, filePath] of Object.entries(logFiles)) {
    app.get(`/debug/logs/${name}`, (_, res, next) => {
      res.set('Cache-Control', 'no-store').type('text/plain');

      if (!filePath) {
        res.status(503).send('Log path is not configured.');
        return;
      }

      res.sendFile(
        resolve(serverDirectory, filePath),
        { lastModified: false },
        err => {
          if (!err) {
            return;
          }

          if (res.headersSent) {
            next(err);
            return;
          }

          if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
            res.status(404).send('Log file not found.');
            return;
          }

          console.error(`Failed to read ${name} log:`, err);
          res.status(500).send('Unable to read log file.');
        }
      );
    });
  }

  // Proxy backend requests while preserving their route prefixes upstream.
  const proxy = createProxyServer({
    target: PROXY_TARGET,
    changeOrigin: true,
    headers: { Authorization: `Bearer ${cachedSecret}` }
  });
  app.use(async (req, res, next) => {
    if (!req.path.startsWith('/kiosk') && !req.path.startsWith('/api')) {
      next();
      return;
    }

    try {
      await proxy.web(req, res);
    } catch (err) {
      console.error('Proxy error:', err instanceof Error ? err.message : err);
      if (res.headersSent) {
        res.destroy();
        return;
      }
      res.status(502).json({ error: 'Proxy failed to reach server.' });
    }
  });

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
