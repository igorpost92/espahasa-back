import { User } from './users/user.entity';

export interface ClassConstructor {
  new (...args: any[]);
}

// TODO: MaybeAppSession optional
export interface AppSession {
  userId?: string;
}

// TODO: doesn't work inside docker
// declare module 'Express' {
//   export interface Request {
//     session?: AppSession;
//     currentUser?: User;
//   }
// }

declare global {
  namespace Express {
    export interface Request {
      session?: AppSession;
      currentUser?: User;
    }
  }

  namespace NodeJS {
    export interface ProcessEnv {
      APP_PORT: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_TYPE: string;
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;
    }
  }
}
