module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/tests/mocks/fileMock.js",
    "\\.(css|less)$": "<rootDir>/tests/mocks/styleMock.js"
  },
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  collectCoverageFrom: [
    "src/js/**/*.js",
    "!src/js/app.js"
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
