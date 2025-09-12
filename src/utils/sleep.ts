export const sleep = (ms: number) =>
  new Promise((promise) => setTimeout(promise, ms));
