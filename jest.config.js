
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts', '<rootDir>/tests/utils/jest-matchers.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  transform: {
    '^.+\\.(ts|html)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
      },
    ],
  },
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/tests/**/*.spec.ts',
  ],
  collectCoverageFrom: [
    'src/app/sm/**/*.ts',
    '!src/**/*.spec.ts',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/app/$1',
    '^@test/(.*)$': '<rootDir>/tests/$1',
  },
};
