{
  "preset": "ts-jest",
  "testEnvironment": "node",
  "roots": ["<rootDir>/src", "<rootDir>/tests"],
  "testMatch": [
    "**/__tests__/**/*.ts",
    "**/?(*.)+(spec|test).ts"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "collectCoverageFrom": [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/*.test.ts",
    "!src/**/*.spec.ts"
  ],
  "coverageDirectory": "coverage",
  "coverageReporters": [
    "text",
    "lcov",
    "html"
  ],
  "setupFilesAfterEnv": ["<rootDir>/tests/setup.ts"],
  "testTimeout": 30000,
  "verbose": true,
  "forceExit": true,
  "clearMocks": true,
  "resetMocks": true,
  "restoreMocks": true,
  "moduleNameMapping": {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  "globals": {
    "ts-jest": {
      "useESM": true,
      "tsconfig": {
        "module": "ESNext"
      }
    }
  },
  "extensionsToTreatAsEsm": [".ts"],
  "testEnvironmentOptions": {
    "url": "http://localhost:3001"
  }
}
