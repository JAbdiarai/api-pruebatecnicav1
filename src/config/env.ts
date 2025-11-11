import "dotenv/config";

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  dbUrl: process.env.DATABASE_URL!,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  cryptoKeyHex: process.env.CRYPTO_KEY_HEX!,
  cryptoAuthTagLen: parseInt(process.env.CRYPTO_AUTH_TAG_LEN || "16", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  // HTTPS
  httpsEnabled: (process.env.HTTPS_ENABLED || "false").toLowerCase() === "true",
  httpsKeyPath: process.env.HTTPS_KEY_PATH || "",
  httpsCertPath: process.env.HTTPS_CERT_PATH || "",
  httpsPassphrase: process.env.HTTPS_PASSPHRASE || undefined,
};
