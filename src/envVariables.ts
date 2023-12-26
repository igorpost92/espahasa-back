const appPort = process.env.APP_PORT ?? 3000;
const logsEnabled = process.env.LOGS_ENABLED === 'true';

const dbHost = process.env.DB_HOST;
const dbPort = Number(process.env.DB_PORT);
const dbType: any = process.env.DB_TYPE;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const keyPath = process.env.HTTPS_KEY_PATH;
const certPath = process.env.HTTPS_CERT_PATH;

const https =
  keyPath && certPath
    ? {
        keyPath,
        certPath,
      }
    : undefined;

export const envVariables = {
  appPort,
  logsEnabled,
  database: {
    host: dbHost,
    port: dbPort,
    type: dbType,
    name: dbName,
    user: dbUser,
    password: dbPassword,
  },
  https,
};
