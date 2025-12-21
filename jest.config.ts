module.exports = {
  testEnvironment: "jsdom",

  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/index.tsx"
  ],

  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  coverageThreshold: {
    global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
    }
  }

};
