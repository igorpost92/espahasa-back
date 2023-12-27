export const shuffle = <T>(arr: T[]) =>
  // TODO: front
  // TODO: lodash
  [...arr].sort(() => Math.random() - 0.5);
