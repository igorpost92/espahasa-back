import { AsyncLocalStorage } from 'node:async_hooks';
import { User } from '../user.entity';

export const userAsyncLocalStorage = new AsyncLocalStorage<{
  currentUser?: User;
}>();
