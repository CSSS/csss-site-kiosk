const provider =
  process.env.NODE_ENV === 'production'
    ? await import('./secrets.production.js')
    : await import('./secrets.development.js');

export const { getSecret } = provider;
