/* Sencillo logger centralizado para ajustar formato en un solo lugar */
export const logger = {
  info: (msg: string, ...args: unknown[]): void => {
    console.log(`[INFO] ${msg}`, ...args);
  },
  error: (msg: string, ...args: unknown[]): void => {
    console.error(`[ERROR] ${msg}`, ...args);
  }
};
