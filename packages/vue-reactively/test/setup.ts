import { config } from "@vue/test-utils";

// Mock global process for Node.js environment variables
if (typeof global !== "undefined") {
  (global as any).process = {
    env: {
      NODE_ENV: "test",
    },
  };
} else if (typeof globalThis !== "undefined") {
  (globalThis as any).process = {
    env: {
      NODE_ENV: "test",
    },
  };
}

// Configure Vue Test Utils global properties
config.global.stubs = {
  // Add any global component stubs here if needed
};

// Mock console.warn to avoid noise in tests
const originalWarn = console.warn;

// Use type assertion to access vitest globals
declare global {
  var beforeEach: (fn: () => void) => void;
  var afterEach: (fn: () => void) => void;
  var vi: any;
}

if (typeof beforeEach !== "undefined") {
  beforeEach(() => {
    if (typeof vi !== "undefined") {
      console.warn = vi.fn();
    }
  });
}

if (typeof afterEach !== "undefined") {
  afterEach(() => {
    console.warn = originalWarn;
  });
}
