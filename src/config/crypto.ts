import * as crypto from "crypto";
import { config } from "./env";

const key = Buffer.from(config.cryptoKeyHex, "hex"); // 32 bytes
if (key.length !== 32) {
  throw new Error(
    `CRYPTO_KEY_HEX inválida: se esperan 32 bytes (64 hex chars) y se recibieron ${key.length} bytes. ` +
      `Genera una clave segura, por ejemplo con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
  );
}

const authTagLength = Math.max(12, Math.min(config.cryptoAuthTagLen, 16));

export function encryptToBuffer(plain: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv, { authTagLength });
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { ciphertext: Buffer.concat([enc, tag]), iv };
}
