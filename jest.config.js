/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/index.tsx"
  ],

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],

  coverageThreshold: {
    global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
    }
  },

  moduleNameMapper: {
    "\\.(wav|mp3)$": "<rootDir>/src/mocks/fileMock.ts",
    "\\.(css)$": "identity-obj-proxy"
  }

};
