/** @type {import('jest').Config} */
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/_domain/(.*)$': '<rootDir>/_domain/$1',
    '^@/_adapter/(.*)$': '<rootDir>/_adapter/$1',
    '^@/_di/(.*)$': '<rootDir>/_di/$1',
    '^@/_uiFragments/(.*)$': '<rootDir>/_uiFragments/$1',
  },
  // NOTE: backend tests need 'node' environment but we use jsdom globally.
  // Override in package.json scripts once we split test configs.
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    '_domain/**/*.{ts,tsx}',
    '_adapter/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
