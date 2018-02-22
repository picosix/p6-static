module.exports = {
  testMatch: [
    "**/__tests__/**/*.test.(ts|js)",
    "**/?(*.)(spec|test).test.(ts|js)"
  ],
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*", "!src/settings.js", "!src/routes/*"]
};
