export function getSecret() {
  const secret = process.env.KIOSK_API_SECRET;
  if (!secret) {
    throw new Error('`KIOSK_API_SECRET` not set in .env.');
  }
  return secret;
}
