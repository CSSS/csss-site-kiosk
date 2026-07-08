import { Entry } from '@napi-rs/keyring';
import os from 'os';

export function getSecret() {
  if (os.platform() !== 'win32') {
    console.error('Production kiosk designed for Windows only.');
  }
  const entry = new Entry('kiosk-proxy', 'demo');
  return entry.getPassword();
}
