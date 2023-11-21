import { wait } from './wait';

export const retry = async <T>(
  attempts: number,
  ms: number,
  fn: () => Promise<T>,
): Promise<T> => {
  try {
    const result = await fn();
    return result;
  } catch (e) {
    const attemptsLeft = attempts - 1;
    if (attemptsLeft < 1) {
      throw e;
    }

    await wait(ms);
    return retry(attemptsLeft, ms, fn);
  }
};
