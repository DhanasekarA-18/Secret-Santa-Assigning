// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
  },
};
