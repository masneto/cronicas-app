export default {
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.github/actions/",
  ],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  moduleFileExtensions: ["js"],
  testMatch: [
    "**/__tests__/**/*.test.js",
    "**/test/**/*.test.js",
  ],
};