const appPort = process.env.APP_PORT ?? 3000;

const dbHost = process.env.DB_HOST;
const dbPort = Number(process.env.DB_PORT);
const dbType: any = process.env.DB_TYPE;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

export const envVariables = {
  appPort,
  database: {
    host: dbHost,
    port: dbPort,
    type: dbType,
    name: dbName,
    user: dbUser,
    password: dbPassword,
  },
};