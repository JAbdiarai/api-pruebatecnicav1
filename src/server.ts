import app from "./app";
import { config } from "./config/env";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";

function startServer() {
  const port = config.port;

  if (config.httpsEnabled) {
    try {
      if (!config.httpsKeyPath || !config.httpsCertPath) {
        throw new Error("HTTPS_ENABLED=true pero faltan HTTPS_KEY_PATH o HTTPS_CERT_PATH");
      }
      const key = fs.readFileSync(config.httpsKeyPath);
      const cert = fs.readFileSync(config.httpsCertPath);
      const options: https.ServerOptions = {
        key,
        cert,
        passphrase: config.httpsPassphrase,
      };
      https.createServer(options, app).listen(port, () => {
        console.log(`API listening securely on https://localhost:${port}`);
      });
      return;
    } catch (err) {
      console.error(`[HTTPS] No se pudo iniciar en modo seguro: ${(err as Error).message}. Haciendo fallback a HTTP.`);
    }
  }

  http.createServer(app).listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

startServer();
