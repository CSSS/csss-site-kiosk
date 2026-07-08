import dotenv from 'dotenv';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { getSecret } from './secrets/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const PORT = process.env.SERVER_PORT || 8080;
const PROXY_TARGET = process.env.PROXY_TARGET;

// The folder our frontend is served from.
const FRONTEND_PATH = join(__dirname, '..', 'dist', 'csss-kiosk-site', 'browser');

const app = express();

if (!PROXY_TARGET) {
  console.error('Set `PROXY_TARGET` as an environment variable.');
  process.exit(1);
}

// This is the secret that will be used to communicate with the web server.
let cachedSecret;
try {
  cachedSecret = getSecret();
  if (!cachedSecret) {
    throw new Error('Secret is empty. Ensure it is set in the keyring or environment.');
  }
  console.log('Secret successfully loaded.');
} catch (err) {
  console.error('Failed to load secret:', err);
  process.exit(1);
}

// Proxy API requests to our web server
app.use(
  '/api',
  createProxyMiddleware({
    target: PROXY_TARGET,
    changeOrigin: true,
    on: {
      proxyReq: proxyReq => {
        proxyReq.setHeader('Authorization', `Bearer ${cachedSecret}`);
      },
      error: (err, _, res) => {
        console.error('Proxy error:', err.message);
        res.status(502).json({ error: 'Proxy failed to reach server.' });
      }
    }
  })
);

// Serve the built frontend files
app.use(express.static(FRONTEND_PATH));

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
