/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  testMatch: [
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  verbose: true,
  forceExit: true,
  clearMocks: true,
};

module.exports = config;
