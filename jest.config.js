module.exports = {
    testEnvironment: 'node',
    testPathIgnorePatterns: [
      '/node_modules/',
      '/.github/actions/'
    ],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };