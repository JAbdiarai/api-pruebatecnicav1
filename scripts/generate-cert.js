const fs = require('fs');
const path = require('path');
const selfsigned = require('selfsigned');

const attrs = [{ name: 'commonName', value: 'localhost' }];
const opts = {
  days: 365,
  keySize: 2048,
  algorithm: 'sha256',
  extensions: [
    {
      name: 'subjectAltName',
      altNames: [
        { type: 2, value: 'localhost' }, // DNS
        { type: 7, ip: '127.0.0.1' },   // IPv4
        { type: 7, ip: '::1' }          // IPv6
      ]
    }
  ]
};

console.log('Generating self-signed certificate for localhost...');
const pems = selfsigned.generate(attrs, opts);

const outDir = path.join(process.cwd(), 'certs');
fs.mkdirSync(outDir, { recursive: true });

const keyPath = path.join(outDir, 'key.pem');
const certPath = path.join(outDir, 'cert.pem');

fs.writeFileSync(keyPath, pems.private, { encoding: 'utf8', flag: 'w' });
fs.writeFileSync(certPath, pems.cert, { encoding: 'utf8', flag: 'w' });

console.log('Created:');
console.log(' -', keyPath);
console.log(' -', certPath);
console.log('\nAdd to your .env:');
console.log('HTTPS_ENABLED=true');
console.log('HTTPS_KEY_PATH=' + keyPath.replace(/\\/g, '/'));
console.log('HTTPS_CERT_PATH=' + certPath.replace(/\\/g, '/'));
