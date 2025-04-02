export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.github/actions/",
  ],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  moduleFileExtensions: ["ts", "js"],
  testMatch: [
    "**/__tests__/**/*.test.{ts,js}",
    "**/test/**/*.test.{ts,js}",
  ],
};