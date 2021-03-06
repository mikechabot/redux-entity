module.exports = {
  verbose: true,
  collectCoverageFrom: ['src/**/*.{js,ts}', '!**/node_modules/**', '!**/vendor/**'],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  coverageDirectory: 'coverage',
  preset: 'ts-jest',
  coverageThreshold: {
    global: {
      lines: 90,
      statements: 90,
    },
  },
};
