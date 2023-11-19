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
}
