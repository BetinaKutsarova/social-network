import "@testing-library/jest-dom";

declare global {
  const describe: typeof import('@jest/globals').describe;
  const expect: typeof import('@jest/globals').expect;
  const test: typeof import('@jest/globals').test;
  const jest: typeof import('@jest/globals').jest;
  const beforeEach: typeof import('@jest/globals').beforeEach;
}


